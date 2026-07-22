import { CardImplementation } from './types';
import { AmusementPark } from './AmusementPark';
import { Army } from './Army';
import { Cannibalistic } from './Cannibalistic';
import { HighAltitudeBombing } from './HighAltitudeBombing';
import { ItHasAChild } from './ItHasAChild';
import { JetFighters } from './JetFighters';
import { Jets } from './Jets';
import { MadeInALab } from './MadeInALab';
import { Metamorph } from './Metamorph';
import { Mimic } from './Mimic';
import { MonsterBatteries } from './MonsterBatteries';
import { NationalGuard } from './NationalGuard';
import { NovaBreath } from './NovaBreath';
import { NuclearPowerPlant } from './NuclearPowerPlant';
import { Omnivore } from './Omnivore';
import { Opportunist } from './Opportunist';
import { PoisonQuills } from './PoisonQuills';
import { PoisonSpit } from './PoisonSpit';
import { Regeneration } from './Regeneration';
import { Skyscraper } from './Skyscraper';
import { SolarPowered } from './SolarPowered';
import { SpikedTail } from './SpikedTail';
import { Tanks } from './Tanks';
import { ThrowATanker } from './ThrowATanker';
import { Urbavore } from './Urbavore';

export const CARD_REGISTRY: Record<string, CardImplementation> = {
  [AmusementPark.id]: AmusementPark,
  [Army.id]: Army,
  [Cannibalistic.id]: Cannibalistic,
  [HighAltitudeBombing.id]: HighAltitudeBombing,
  [ItHasAChild.id]: ItHasAChild,
  [JetFighters.id]: JetFighters,
  [Jets.id]: Jets,
  [MadeInALab.id]: MadeInALab,
  [Metamorph.id]: Metamorph,
  [Mimic.id]: Mimic,
  [MonsterBatteries.id]: MonsterBatteries,
  [NationalGuard.id]: NationalGuard,
  [NovaBreath.id]: NovaBreath,
  [NuclearPowerPlant.id]: NuclearPowerPlant,
  [Omnivore.id]: Omnivore,
  [Opportunist.id]: Opportunist,
  [PoisonQuills.id]: PoisonQuills,
  [PoisonSpit.id]: PoisonSpit,
  [Regeneration.id]: Regeneration,
  [Skyscraper.id]: Skyscraper,
  [SolarPowered.id]: SolarPowered,
  [SpikedTail.id]: SpikedTail,
  [Tanks.id]: Tanks,
  [ThrowATanker.id]: ThrowATanker,
  [Urbavore.id]: Urbavore,
};
