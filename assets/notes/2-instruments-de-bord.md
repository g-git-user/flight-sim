## Instruments de bord

### Anémomètre *(Badin)*

Mesure la vitesse en calculant la différence entre la **pression totale** (tube Pitot) et la **pression statique** (prise latérale).

**Arc blanc** — Plage d'utilisation des volets
* Limite inférieure : **$\text{V}_{\text{S0}}$** *(vitesse de décrochage en configuration atterrissage)*
* Limite supérieure : **$\text{V}_{\text{FE}}$** *(vitesse maximale volets sortis)*


**Arc vert** — Plage d'utilisation normale (air lisse)
* Limite inférieure : **$\text{V}_{\text{S1}}$** *(vitesse de décrochage en configuration lisse)*
* Limite supérieure : **$\text{V}_{\text{NO}}$** *(vitesse maximale de croisière normale)*


**Arc jaune / orange** — Plage de précaution (air calme uniquement)
* Limite inférieure : **$\text{V}_{\text{NO}}$**
* Limite supérieure : **$\text{V}_{\text{NE}}$** *(vitesse à ne jamais dépasser)*


**Trait rouge** — Vitesse limite absolue ($\text{V}_{\text{NE}}$)

![Anémomètre](https://raw.githubusercontent.com/g-git-user/flight-sim/refs/heads/main/assets/img/anemometre.jpg)

### Horizon artificiel

Indique l’assiette *(pitch)* et l’inclinaison *(roll)* de l’appareil par rapport à la ligne d’horizon grâce à un gyroscope à axe vertical.

![Horizon artificiel](https://raw.githubusercontent.com/g-git-user/flight-sim/refs/heads/main/assets/img/horizon.jpg)

### Altimètre

Baromètre mesurant l'altitude ou la hauteur en fonction de la pression statique. Il se règle à l'aide d'une molette selon trois calages principaux :

| Calage | Signification | Référence | Utilisation |
| --- | --- | --- | --- |
| **QFE** | *Atmospheric pressure at Field Elevation* | Pression au sol de l'aérodrome | Affiche 0 au sol (indique une hauteur) |
| **QNH** | *Atmospheric pressure at Nautical Height* | Pression au niveau moyen de la mer | Affiche l'altitude réelle par rapport à la mer |
| **QNE / FL** | *Standard pressure setting* | Pression standard (1013,25 hPa) | Niveaux de vol (*Flight Level*) en croisière |

![Altimètre](https://raw.githubusercontent.com/g-git-user/flight-sim/refs/heads/main/assets/img/altimetre.jpg)

---

### Variomètre *(VSI - Vertical Speed Indicator)*

Mesure la **vitesse verticale** de l'appareil (taux de montée ou de descente) exprimée en pieds par minute (ft/min) ou mètres par seconde (m/s).

* Utilise la **variation de pression statique** dans le temps.
* Présente un léger temps de retard (inertie) lors des changements d'attitude.

![Variomètre](https://raw.githubusercontent.com/g-git-user/flight-sim/refs/heads/main/assets/img/variometre.jpg)

### Directionnel *(Conservateur de cap)*

Indique le **cap magnétique** de l'avion de manière stable grâce à un gyroscope à axe horizontal.

* Contrairement au compas magnétique, il n'est pas sujet aux erreurs lors des virages ou accélérations.
* Nécessite un recalage régulier sur le compas (environ toutes les 15 minutes) à cause de la dérive gyroscopique.

![Directionnel](https://raw.githubusercontent.com/g-git-user/flight-sim/refs/heads/main/assets/img/directionnel.jpg)

### Indicateur de virage et de dérapage *(Bille-Aiguille)*

* **Aiguille** : Indique le taux de virage (vitesse de changement de cap).
* **Bille** : Indique la symétrie du virage (virage coordonné, dérapage ou glissade).

![Indicateur de virage et de dérapage](https://raw.githubusercontent.com/g-git-user/flight-sim/refs/heads/main/assets/img/virage.png)

### Tachymètre *(Compte-tours)*

Mesure le **régime moteur** en tours par minute (tr/min). Il est gradué en centaines de tr/min et se règle via la **manette des gaz**.

* Plage d'utilisation continue : **verte**.
* Zone de régime maximale (utilisation temporaire uniquement) : **jaune**.
* Régime à ne jamais dépasser : **rouge**.
* Indique aussi approximativement la puissance délivrée (pour les hélices à pas fixe).

![Tachymètre](https://raw.githubusercontent.com/g-git-user/flight-sim/refs/heads/main/assets/img/tachymetre.jpg)

### Indicateurs moteur

Instruments secondaires surveillant l'état et la santé du moteur :

* **Indicateur de température d'huile (OIL TEMP)** : s'assure que le moteur est dans sa plage de fonctionnement optimale.
* **Indicateur de pression d'huile (OIL PRESS)** : garantit une bonne lubrification du moteur (le vert s'allume si la pression est insuffisante).
* **Jauge de carburant (FUEL)** : indique la quantité de carburant restante dans les réservoirs.
* **Ampèremètre (AMPS)** : contrôle la charge de la batterie et le bon fonctionnement de l'alternateur.

