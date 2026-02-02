# Mesna.to - E-commerce Prodavnica Suvog Mesa

## Katalog Proizvoda
- [x] Kreiraj 6 proizvoda sa slikama, opisima i cenama
  - [x] Sremska kobasica
  - [x] Suvi vrat
  - [x] Pečenica
  - [x] Butkica
  - [x] Kolenica
  - [x] Mast

## Frontend - Korisničko Sučelje
- [x] Dizajn sa tamno-crvenom (#8B0000) i belom/crnom šemom boja
- [x] Implementacija dark/light mode sa adaptivnom šemom boja
- [x] Responzivni dizajn za mobilne i desktop uređaje
- [x] Početna stranica sa katalogom proizvoda
- [x] Prikaz proizvoda sa slikom, opisom i cenom
- [x] Dugme "Dodaj u korpu" za svaki proizvod
- [x] Korpa sa mogućnošću dodavanja/uklanjanja proizvoda
- [x] Prikaz ukupne cene u korpi
- [x] Forma za naručivanje sa poljima: ime, prezime, adresa, telefon, napomena
- [x] Validacija forme pre nego što se narudžbina pošalje

## Backend - Funkcionalnost
- [x] Kreiraj bazu podataka sa tabelama za proizvode i narudžbine
- [x] API endpoint za preuzimanje liste proizvoda
- [x] API endpoint za kreiranje narudžbine
- [x] Email integracija za slanje narudžbina na test123@gmail.com
- [x] Slanje email notifikacija vlasniku sa detaljima narudžbine
- [x] Validacija podataka narudžbine na backend-u

## Testiranje
- [x] Unit testovi za backend logiku
- [x] Integrativni testovi za email slanje
- [ ] Testiranje responsivnog dizajna
- [ ] Testiranje dark/light mode prebacivanja
- [ ] Testiranje dodavanja/uklanjanja proizvoda iz korpe
- [ ] Testiranje forme za naručivanje

## Deployment
- [x] Finalna provera svih funkcionalnosti
- [x] Optimizacija performansi
- [ ] Checkpoint i publikovanje sajta


## Logo Integracija
- [x] Kopirati logo u client/public folder
- [x] Integrisati logo u header na Home stranici
- [x] Postaviti logo kao favicon
- [x] Testirati prikaz loga na svim stranicama

## Loading Animation
- [x] Kreiraj loading komponendu sa animacijom
- [x] Integriraj loading animaciju u App.tsx
- [x] Prikaži loading dok se proizvodi učitavaju
- [x] Testiraj loading animaciju


## Dokumentacija
- [x] Kreiraj README.md sa instrukcijama za lokalni i produkcijski deploy


## Bezbednost
- [x] Implementiraj rate limiting za zaštitu od spam-a
- [ ] Dodaj validaciju email adrese
- [ ] Implementiraj CAPTCHA za dodatnu zaštitu


## Google SSO i Istorija Naruđbina
- [x] Dodaj userId u orders tabelu
- [x] Kreiraj stranicu sa istorijom naruđbina po korisniku
- [x] Dodaj mogućnost pregleda detalja naruđbine
- [x] Dodaj link na OrderHistory u header
- [x] Testiraj Google SSO i istoriju naruđbina

## Google SSO Integracija
- [x] Zameni Manus OAuth sa Google SSO (dodan kao alternativa)
- [x] Konfiguriši Google OAuth kredencijale
- [x] Testiraj Google login
- [x] Dodaj Google login dugme u header
