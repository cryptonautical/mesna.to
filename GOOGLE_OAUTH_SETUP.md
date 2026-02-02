# Google OAuth Setup - Mesna.to

Ovaj dokument sadrži detaljne instrukcije za konfiguraciju Google OAuth-a za Mesna.to e-commerce sajt.

## Korak 1: Kreiraj Google Cloud Projekt

1. Idi na [Google Cloud Console](https://console.cloud.google.com/)
2. Klikni na **Select a Project** dugme u gornjem levom uglu
3. Klikni na **NEW PROJECT**
4. Unesi naziv projekta: `Mesna.to` (ili bilo koji naziv koji ti se sviđa)
5. Klikni **CREATE**
6. Čekaj da se projekat kreira (može potrajati nekoliko sekundi)

## Korak 2: Omogući Google+ API

1. U Google Cloud Console-u, idi na **APIs & Services** > **Library**
2. Pretraži `Google+ API`
3. Klikni na rezultat
4. Klikni **ENABLE**
5. Čekaj da se API omogući

## Korak 3: Kreiraj OAuth 2.0 Kredencijale

1. Idi na **APIs & Services** > **Credentials**
2. Klikni na **+ CREATE CREDENTIALS** dugme
3. Izaberi **OAuth client ID**
4. Ako se pojavi upozorenje da trebaš da konfiguriš OAuth consent screen, klikni **CONFIGURE CONSENT SCREEN**

### Konfiguracija OAuth Consent Screen-a

1. Izaberi **External** kao tip korisnika
2. Klikni **CREATE**
3. Popuni obavezna polja:
   - **App name**: `Mesna.to`
   - **User support email**: Tvoja email adresa
   - **Developer contact information**: Tvoja email adresa
4. Klikni **SAVE AND CONTINUE**
5. Na **Scopes** stranici, klikni **SAVE AND CONTINUE** (default scope-ovi su dovoljni)
6. Na **Test users** stranici, klikni **SAVE AND CONTINUE**
7. Na **Summary** stranici, klikni **BACK TO DASHBOARD**

### Kreiraj OAuth Client ID

1. Idi nazad na **APIs & Services** > **Credentials**
2. Klikni na **+ CREATE CREDENTIALS**
3. Izaberi **OAuth client ID**
4. Izaberi **Web application** kao tip aplikacije
5. Pod **Authorized JavaScript origins**, dodaj:
   - `http://localhost:3000` (za lokalni razvoj)
   - `https://yourdomain.com` (zameni sa tvojim pravim domenom kada deploy-uješ)
6. Pod **Authorized redirect URIs**, dodaj:
   - `http://localhost:3000/api/auth/google/callback` (za lokalni razvoj)
   - `https://yourdomain.com/api/auth/google/callback` (za produkciju)
7. Klikni **CREATE**

## Korak 4: Preuzmi Kredencijale

1. Trebao bi da vidiš modal sa tvojim **Client ID** i **Client Secret**
2. Klikni **DOWNLOAD JSON** da preuzmeš fajl, ili ručno prepiši vrednosti
3. **ČUVA TAJNO**: Client Secret nikada ne deli sa nikime!

## Korak 5: Dodaj Kredencijale u Mesna.to

1. Otvori Manus Management UI za mesna.to projekat
2. Idi na **Settings** > **Secrets**
3. Dodaj dve nove tajne:
   - **GOOGLE_CLIENT_ID**: Tvoj Client ID iz Google Cloud Console-a
   - **GOOGLE_CLIENT_SECRET**: Tvoj Client Secret iz Google Cloud Console-a
4. Klikni **SAVE**

## Korak 6: Testiraj Google Login

1. Otvori Mesna.to sajt u browser-u
2. Klikni na **Login** dugme (ikona sa strelom) u header-u
3. Trebao bi da vidiš Google login opciju
4. Klikni i prijavi se sa svojom Google nalogom
5. Trebao bi da budeš preusmeren na sajt i prijavljen

## Troubleshooting

### "Invalid client" greška
- Proveri da li su Client ID i Client Secret ispravno uneti
- Proveri da li je tvoj redirect URI tačan

### "Redirect URI mismatch" greška
- Dodaj sve potrebne redirect URI-je u Google Cloud Console
- Uključi i `http://` i `https://` verzije

### Login dugme se ne pojavljuje
- Restartuj dev server
- Očisti browser cache (Ctrl+Shift+Delete)
- Proveri da li su tajne ispravno postavljene

## Dodatne Resurse

- [Google OAuth 2.0 Dokumentacija](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

## Bezbednost

- Nikada ne deli Client Secret sa nikime
- Nikada ne commit-uj Client Secret u git repozitorijum
- Koristi environment varijable za čuvanje kredencijala
- Redovno rotira kredencijale (preporuka: svakih 90 dana)
