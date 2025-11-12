#!/bin/bash

echo "🧹 StandBy App - Cache Reset Script"
echo "===================================="
echo ""

echo "1️⃣  Lösche Expo Cache..."
rm -rf .expo

echo "2️⃣  Lösche Metro Cache..."
rm -rf node_modules/.cache .metro

echo "3️⃣  Lösche temporäre Dateien..."
rm -rf /tmp/react-* /tmp/metro-* 2>/dev/null || true

echo "4️⃣  Prüfe Watchman..."
if command -v watchman &> /dev/null; then
    echo "    Watchman gefunden - lösche Cache..."
    watchman watch-del-all
else
    echo "    Watchman nicht installiert (nicht kritisch)"
fi

echo ""
echo "✅ Cache erfolgreich gelöscht!"
echo ""
echo "Nächste Schritte:"
echo "1. npm start -- --clear"
echo "2. Expo Go App schließen & neu öffnen"
echo "3. QR Code neu scannen"
echo ""
