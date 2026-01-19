from django.core.management.base import BaseCommand
from api.models import Person

class Command(BaseCommand):
    help = 'Seeds database with family data'

    def handle(self, *args, **options):
        Person.objects.all().delete()
        
        grandpa = Person.objects.create(name="Jhangu Sheikh", birth_year=1940, notes="Root Ancestor")
        
        jaggu = Person.objects.create(name="Jaggu Sheikh", parent=grandpa)
        
        rahmuddin = Person.objects.create(name="Rahmuddin Miya", parent=jaggu)
        
        nashralli = Person.objects.create(name="Nashralli Miya", parent=rahmuddin)
        ali_hasan = Person.objects.create(name="AliHasan", parent=nashralli)
        abdullah = Person.objects.create(name="Abdullah Miya", parent=nashralli)
        
        mohram = Person.objects.create(name="Mohram Ali", parent=abdullah)
        mumtaj = Person.objects.create(name="Mumtaj Ali", parent=mohram)
        Person.objects.create(name="Sarfaraz Ali", parent=mumtaj)
        Person.objects.create(name="Washim Ali", parent=mumtaj)
        
        # Another branch
        qurban = Person.objects.create(name="Qurban Miyan", parent=rahmuddin)
        gafoor = Person.objects.create(name="Gafoor", parent=qurban)
        Person.objects.create(name="Rahman", parent=gafoor)
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded family tree with sample data'))
