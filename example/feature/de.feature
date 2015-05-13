# language: de
Funktionalität: Nutzer ersetzt Metaprodukt oder Sortimentsaktion durch Produkt
   
   Als ein Nutzer
   möchte ich Metaprodukte oder Sortimentsaktionen durch ein konkretes Produkt ersetzen,
   damit ich den genauen Preis und korrekte Informationen in der Einkaufsliste sehe

   Metaprodukte und Sortimentsaktionen sind Produktplatzhalter, die der Nutzer ersetzen kann. Produktplatzhalter können über folgende Routen ersetzt werden:
   (1) Metaprodukt --> Produkt
   (2) Metaprodukt --> Sortimentsaktion
   (3) Sortimentsaktion --> Produkt
   Ein Produktplatzhalter wird ausschließlich nur durch das jeweils zuerst ausgewählte Produkt, ausgehend von der Einkaufsliste, ersetzt.

   Szenariogrundriss: Nutzer erhöht die Menge durch Wischen nach rechts um 1
      # Die Aktion wird für alle Geräte des Nutzer sowie für alle Teilnehmer der Liste durchgeführt
      Angenommen die Einkaufsliste wird angezeigt
      Wenn der Nutzer auf einem <Listeneintrag> nach rechts wischt
      Und die Einheit ist Stückzahl
      Dann soll die Stückzahl um 1 erhöht werden

      Beispiele:
      | Listeneintrag    |
      | Produkt          |
      | Metaprodukt      |
      | Sortimentsaktion |

