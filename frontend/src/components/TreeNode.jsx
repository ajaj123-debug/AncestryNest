import React from 'react';

const TreeNode = ({ person, onAddChild, onEdit, onAddSibling }) => {

    // Determine gender color
    const genderColor = person.gender === 'F' ? '#ffebf7' : '#e6f4ff'; // Pinkish for female, Blueish for male/default
    const borderColor = person.gender === 'F' ? '#ffb6d9' : '#94a0b4';

    return (
        <li>
            <div
                className="node-card"
                onClick={() => onEdit(person)}
                style={{ backgroundColor: genderColor, borderColor: borderColor }}
            >
                <div>{person.name}</div>
                {person.spouse_name && (
                    <div style={{ fontSize: '0.85em', color: '#555', fontWeight: '500' }}>
                        Spouse: {person.spouse_name}
                    </div>
                )}
                {person.birth_year && (
                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                        {person.birth_year} - {person.death_year || 'Present'}
                    </div>
                )}
                {person.profession && <div style={{ fontSize: '0.8em', fontStyle: 'italic' }}>{person.profession}</div>}

                <div className="node-actions">
                    <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); onEdit(person); }}
                        title="Edit Details"
                    >
                        Edit
                    </button>
                    <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); onAddChild(person.id); }}
                        title="Add Child"
                    >
                        + Child
                    </button>
                    <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); onAddSibling(person); }}
                        title="Add Sibling"
                    >
                        + Sib
                    </button>
                </div>
            </div>
            {person.children && person.children.length > 0 && (
                <ul>
                    {person.children.map(child => (
                        <TreeNode
                            key={child.id}
                            person={child}
                            onAddChild={onAddChild}
                            onAddSibling={onAddSibling}
                            onEdit={onEdit}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TreeNode;
