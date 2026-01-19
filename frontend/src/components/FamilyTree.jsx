import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import apiClient from '../api/client';
import TreeNode from './TreeNode';
import PersonForm from './PersonForm';
import { ZoomIn, ZoomOut, Move, RotateCcw, Maximize2 } from 'lucide-react';

const FamilyTree = () => {
    const [roots, setRoots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ parentId: null, personToEdit: null });
    
    // Zoom and pan state
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);
    const treeContainerRef = useRef(null);
    const treeContentRef = useRef(null);

    const fetchTree = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('tree/');
            setRoots(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tree data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTree();
    }, []);

    const handleAddRoot = () => {
        setModalConfig({ parentId: null, personToEdit: null });
        setShowModal(true);
    };

    const handleAddChild = (parentId) => {
        setModalConfig({ parentId, personToEdit: null });
        setShowModal(true);
    };

    const handleAddSibling = (person) => {
        // Add sibling means adding a child to the same parent.
        // person.parent is the ID of the parent.
        // If person is a root (parent is null), then we add a new root (parentId = null).
        setModalConfig({ parentId: person.parent, personToEdit: null });
        setShowModal(true);
    };

    const handleEditPerson = (person) => {
        setModalConfig({ parentId: null, personToEdit: person });
        setShowModal(true);
    };

    const handleFormSuccess = () => {
        setShowModal(false);
        fetchTree();
    };

    // Calculate maximum generation depth (pidhi)
    const calculateMaxDepth = useCallback((persons, currentDepth = 1) => {
        if (!persons || persons.length === 0) return 0;
        
        let maxDepth = currentDepth;
        for (const person of persons) {
            if (person.children && person.children.length > 0) {
                const childDepth = calculateMaxDepth(person.children, currentDepth + 1);
                maxDepth = Math.max(maxDepth, childDepth);
            }
        }
        return maxDepth;
    }, []);

    const maxGenerations = useMemo(() => {
        if (roots.length === 0) return 0;
        return calculateMaxDepth(roots);
    }, [roots, calculateMaxDepth]);

    // Count men, women, and female spouses in the tree
    const countGender = useCallback((persons) => {
        let men = 0;
        let women = 0;
        
        const traverse = (personList) => {
            if (!personList || personList.length === 0) return;
            
            for (const person of personList) {
                if (person.gender === 'M') {
                    men++;
                    // If male person has a spouse, count the spouse as a female
                    if (person.spouse_name && person.spouse_name.trim() !== '') {
                        women++;
                    }
                } else if (person.gender === 'F') {
                    women++;
                }
                
                // Recursively count children
                if (person.children && person.children.length > 0) {
                    traverse(person.children);
                }
            }
        };
        
        traverse(persons);
        return { men, women };
    }, []);

    const genderCounts = useMemo(() => {
        if (roots.length === 0) return { men: 0, women: 0 };
        return countGender(roots);
    }, [roots, countGender]);

    // Zoom handlers
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 0.3));
    };

    const handleResetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleFitToScreen = () => {
        if (!treeContainerRef.current || !treeContentRef.current || roots.length === 0) {
            return;
        }

        // Wait for next frame to ensure tree is rendered
        requestAnimationFrame(() => {
            const viewport = treeContainerRef.current;
            const treeElement = treeContentRef.current.querySelector('.tree');
            
            if (!viewport || !treeElement) return;

            const viewportRect = viewport.getBoundingClientRect();
            
            // Temporarily reset transform to get accurate measurements
            const currentTransform = treeContentRef.current.style.transform;
            const currentTransition = treeContentRef.current.style.transition;
            treeContentRef.current.style.transition = 'none';
            treeContentRef.current.style.transform = 'translate(0px, 0px) scale(1)';
            
            // Force a reflow to ensure measurements are accurate
            void treeElement.offsetWidth;
            
            // Find the first root ancestor node card (first li > .node-card in the root ul)
            const rootUl = treeElement.querySelector('ul');
            if (!rootUl) {
                treeContentRef.current.style.transform = currentTransform;
                treeContentRef.current.style.transition = currentTransition;
                return;
            }
            
            const firstRootLi = rootUl.querySelector('li:first-child');
            if (!firstRootLi) {
                treeContentRef.current.style.transform = currentTransform;
                treeContentRef.current.style.transition = currentTransition;
                return;
            }
            
            const rootNodeCard = firstRootLi.querySelector('.node-card');
            if (!rootNodeCard) {
                treeContentRef.current.style.transform = currentTransform;
                treeContentRef.current.style.transition = currentTransition;
                return;
            }
            
            // Get the position of the root node card relative to the tree content
            const treeContentRect = treeContentRef.current.getBoundingClientRect();
            const rootCardRect = rootNodeCard.getBoundingClientRect();
            
            // Calculate the center of the root node card relative to tree content
            const rootCardCenterX = rootCardRect.left - treeContentRect.left + (rootCardRect.width / 2);
            const rootCardCenterY = rootCardRect.top - treeContentRect.top + (rootCardRect.height / 2);
            
            // Restore transform
            treeContentRef.current.style.transform = currentTransform;
            treeContentRef.current.style.transition = currentTransition;
            
            // Viewport dimensions
            const viewportWidth = viewportRect.width;
            const viewportHeight = viewportRect.height;
            
            // Set zoom to 100% (1.0)
            const finalZoom = 1.0;
            
            // Calculate pan to center the root ancestor in the viewport
            // Since transform-origin is 'center center', we need to account for that
            // The pan should position the root card center at the viewport center
            const viewportCenterX = viewportWidth / 2;
            const viewportCenterY = viewportHeight / 2;
            
            // Calculate pan: viewportCenter - (rootCardCenter * zoom)
            // This centers the root card at the viewport center
            const newPanX = viewportCenterX - rootCardCenterX;
            const newPanY = viewportCenterY - rootCardCenterY;
            
            // Update state
            setZoom(finalZoom);
            setPan({ x: newPanX, y: newPanY });
        });
    };

    // Mouse wheel zoom
    const handleWheel = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
        }
    }, []);

    // Pan handlers
    const handleMouseDown = (e) => {
        // Don't start dragging if clicking on buttons, inputs, or links
        if (e.target.closest('button') || 
            e.target.closest('input') || 
            e.target.closest('textarea') ||
            e.target.closest('a')) {
            return;
        }
        
        if (e.button === 0) { // Left mouse button
            // Only start dragging if clicking on empty space (not on node cards)
            if (!e.target.closest('.node-card')) {
                setIsDragging(true);
                setHasMoved(false);
                setDragStart({
                    x: e.clientX - pan.x,
                    y: e.clientY - pan.y
                });
                e.preventDefault();
            }
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const newPan = {
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            };
            
            // Check if mouse has moved significantly
            const deltaX = Math.abs(newPan.x - pan.x);
            const deltaY = Math.abs(newPan.y - pan.y);
            
            if (deltaX > 5 || deltaY > 5) {
                setHasMoved(true);
            }
            
            setPan(newPan);
        }
    }, [isDragging, dragStart, pan]);

    const handleMouseUp = () => {
        setIsDragging(false);
        setHasMoved(false);
    };

    // Pan buttons
    const handlePanLeft = () => {
        setPan(prev => ({ ...prev, x: prev.x - 100 }));
    };

    const handlePanRight = () => {
        setPan(prev => ({ ...prev, x: prev.x + 100 }));
    };

    const handlePanUp = () => {
        setPan(prev => ({ ...prev, y: prev.y - 100 }));
    };

    const handlePanDown = () => {
        setPan(prev => ({ ...prev, y: prev.y + 100 }));
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                handleZoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                handleZoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                handleResetView();
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                handleFitToScreen();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePanLeft();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handlePanRight();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                handlePanUp();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                handlePanDown();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Mouse move and up listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove]);

    if (loading && roots.length === 0) return <div>Loading Tree...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="tree-container">
            <div className="dashboard-controls">
                <button onClick={handleAddRoot} className="save-btn">+ Add New Root Ancestor</button>
                
                {/* Generation Count Display */}
                {maxGenerations > 0 && (
                    <div className="generation-info">
                        <span className="generation-label">Generations:</span>
                        <span className="generation-count">{maxGenerations}</span>
                    </div>
                )}
                
                {/* Gender Count Display */}
                {(genderCounts.men > 0 || genderCounts.women > 0) && (
                    <div className="gender-info">
                        <span className="gender-label">Men:</span>
                        <span className="gender-count gender-male">{genderCounts.men}</span>
                        <span className="gender-separator">|</span>
                        <span className="gender-label">Women:</span>
                        <span className="gender-count gender-female">{genderCounts.women}</span>
                    </div>
                )}
                
                {/* Zoom and Pan Controls */}
                <div className="tree-controls">
                    <div className="control-group">
                        <button 
                            onClick={handleZoomOut} 
                            className="control-btn"
                            title="Zoom Out (-)"
                        >
                            <ZoomOut size={18} />
                        </button>
                        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                        <button 
                            onClick={handleZoomIn} 
                            className="control-btn"
                            title="Zoom In (+)"
                        >
                            <ZoomIn size={18} />
                        </button>
                        <button 
                            onClick={handleResetView} 
                            className="control-btn"
                            title="Reset View (0)"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button 
                            onClick={handleFitToScreen} 
                            className="control-btn"
                            title="Fit to Screen (F)"
                        >
                            <Maximize2 size={18} />
                        </button>
                    </div>
                    
                    <div className="control-group">
                        <button 
                            onClick={handlePanLeft} 
                            className="control-btn"
                            title="Pan Left (←)"
                        >
                            ←
                        </button>
                        <button 
                            onClick={handlePanRight} 
                            className="control-btn"
                            title="Pan Right (→)"
                        >
                            →
                        </button>
                    </div>
                    
                    <div className="control-hint">
                        <Move size={14} />
                        <span>Drag to pan • Ctrl+Scroll to zoom • Press F to fit</span>
                    </div>
                </div>
            </div>

            <div 
                className="tree-viewport"
                ref={treeContainerRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <div 
                    className="tree-content"
                    ref={treeContentRef}
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    <div className="tree">
                        {roots.length === 0 && (
                            <div style={{ marginTop: '100px' }}>
                                <h3>No family members found.</h3>
                                <p>Click "Add New Root Ancestor" to start your tree.</p>
                            </div>
                        )}
                        <ul>
                            {roots.map(person => (
                                <TreeNode
                                    key={person.id}
                                    person={person}
                                    onAddChild={handleAddChild}
                                    onAddSibling={handleAddSibling}
                                    onEdit={handleEditPerson}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {showModal && (
                <PersonForm
                    parentId={modalConfig.parentId}
                    personToEdit={modalConfig.personToEdit}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default FamilyTree;
