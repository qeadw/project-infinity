// Layer 4+ - Industrial elements, machines, and advanced technology
export const INDUSTRIAL_ELEMENTS = {
  // ===== Layer 4 - Industrial Foundations =====
  glass: { id: 'glass', name: 'Glass', emoji: '🪟', recipe: ['sand', 'fire'] },
  ore: { id: 'ore', name: 'Ore', emoji: '⛏️', recipe: ['stone', 'mountain'] },
  furnace: { id: 'furnace', name: 'Furnace', emoji: '🔥', recipe: ['brick', 'fire'] },
  mold: { id: 'mold', name: 'Mold', emoji: '🫕', recipe: ['clay', 'fire'] },
  charcoal: { id: 'charcoal', name: 'Charcoal', emoji: '⬛', recipe: ['plant', 'fire'] },
  pressure: { id: 'pressure', name: 'Pressure', emoji: '🔽', recipe: ['stone', 'earthquake'] },
  heat: { id: 'heat', name: 'Heat', emoji: '🌡️', recipe: ['fire', 'plasma'] },

  // ===== Layer 5 - Base Metals =====
  metal: { id: 'metal', name: 'Metal', emoji: '🔩', recipe: ['ore', 'furnace'] },
  copper: { id: 'copper', name: 'Copper', emoji: '🟠', recipe: ['ore', 'electricity'] },
  iron: { id: 'iron', name: 'Iron', emoji: '⬜', recipe: ['ore', 'charcoal'] },
  tin: { id: 'tin', name: 'Tin', emoji: '⚪', recipe: ['ore', 'water'] },
  lead: { id: 'lead', name: 'Lead', emoji: '🔘', recipe: ['ore', 'pressure'] },

  // ===== Layer 5.5 - Research =====
  research_bench: { id: 'research_bench', name: 'Research Bench', emoji: '🔬', recipe: ['metal', 'metal'], machine: true },
  advanced_research_bench: { id: 'advanced_research_bench', name: 'Advanced Research Bench', emoji: '🧪', recipe: ['steel', 'research_bench'], machine: true },

  // ===== Layer 6 - Alloys =====
  steel: { id: 'steel', name: 'Steel', emoji: '🩶', recipe: ['iron', 'charcoal'] },
  bronze: { id: 'bronze', name: 'Bronze', emoji: '🟤', recipe: ['copper', 'tin'] },
  solder: { id: 'solder', name: 'Solder', emoji: '⚫', recipe: ['tin', 'lead'] },
  brass: { id: 'brass', name: 'Brass', emoji: '🟡', recipe: ['copper', 'iron'] },

  // ===== Layer 7 - Manufacturing Parts =====
  ingot: { id: 'ingot', name: 'Ingot', emoji: '🧈', recipe: ['metal', 'mold'] },
  rod: { id: 'rod', name: 'Rod', emoji: '📏', recipe: ['iron', 'mold'] },
  plate: { id: 'plate', name: 'Plate', emoji: '🛡️', recipe: ['metal', 'pressure'] },
  wire: { id: 'wire', name: 'Wire', emoji: '〰️', recipe: ['copper', 'mold'] },
  sheet: { id: 'sheet', name: 'Sheet', emoji: '📄', recipe: ['steel', 'pressure'] },
  tube: { id: 'tube', name: 'Tube', emoji: '🧪', recipe: ['metal', 'wind'] },
  nail: { id: 'nail', name: 'Nail', emoji: '📌', recipe: ['iron', 'pressure'] },
  bolt: { id: 'bolt', name: 'Bolt', emoji: '🔩', recipe: ['steel', 'mold'] },
  foil: { id: 'foil', name: 'Foil', emoji: '✨', recipe: ['tin', 'pressure'] },
  pipe: { id: 'pipe', name: 'Pipe', emoji: '🔧', recipe: ['lead', 'mold'] },

  // ===== Layer 8 - Advanced Parts =====
  screw: { id: 'screw', name: 'Screw', emoji: '🔩', recipe: ['bolt', 'tornado'] },
  nut: { id: 'nut', name: 'Nut', emoji: '⚙️', recipe: ['bolt', 'pressure'] },
  gear: { id: 'gear', name: 'Gear', emoji: '⚙️', recipe: ['rod', 'rod'] },
  spring: { id: 'spring', name: 'Spring', emoji: '🌀', recipe: ['wire', 'pressure'] },
  rivet: { id: 'rivet', name: 'Rivet', emoji: '⚫', recipe: ['nail', 'pressure'] },
  chain: { id: 'chain', name: 'Chain', emoji: '⛓️', recipe: ['iron', 'iron'] },
  bearing: { id: 'bearing', name: 'Bearing', emoji: '🔘', recipe: ['steel', 'steel'] },
  hinge: { id: 'hinge', name: 'Hinge', emoji: '📎', recipe: ['plate', 'bolt'] },
  bracket: { id: 'bracket', name: 'Bracket', emoji: '📐', recipe: ['plate', 'plate'] },
  washer: { id: 'washer', name: 'Washer', emoji: '⭕', recipe: ['sheet', 'pressure'] },
  clamp: { id: 'clamp', name: 'Clamp', emoji: '🗜️', recipe: ['plate', 'screw'] },
  coil: { id: 'coil', name: 'Coil', emoji: '🧲', recipe: ['wire', 'wire'] },
  cable: { id: 'cable', name: 'Cable', emoji: '🔌', recipe: ['wire', 'copper'] },
  filament: { id: 'filament', name: 'Filament', emoji: '💡', recipe: ['wire', 'heat'] },

  // ===== Layer 9 - Basic Mechanisms =====
  motor: { id: 'motor', name: 'Motor', emoji: '🔄', recipe: ['coil', 'gear'] },
  piston: { id: 'piston', name: 'Piston', emoji: '🔲', recipe: ['tube', 'spring'] },
  lever: { id: 'lever', name: 'Lever', emoji: '🎚️', recipe: ['rod', 'hinge'] },
  pulley: { id: 'pulley', name: 'Pulley', emoji: '🎡', recipe: ['gear', 'bracket'] },
  axle: { id: 'axle', name: 'Axle', emoji: '🛞', recipe: ['rod', 'bearing'] },

  // ===== Layer 10 - Mechanical Systems =====
  engine: { id: 'engine', name: 'Engine', emoji: '🏎️', recipe: ['motor', 'piston'] },
  crankshaft: { id: 'crankshaft', name: 'Crankshaft', emoji: '🔀', recipe: ['axle', 'gear'] },
  pump: { id: 'pump', name: 'Pump', emoji: '🚰', recipe: ['piston', 'pipe'] },
  winch: { id: 'winch', name: 'Winch', emoji: '🏗️', recipe: ['pulley', 'chain'] },
  drivetrain: { id: 'drivetrain', name: 'Drivetrain', emoji: '⚙️', recipe: ['axle', 'chain'] },

  // ===== Layer 11 - Control Systems =====
  switch: { id: 'switch', name: 'Switch', emoji: '🔘', recipe: ['lever', 'cable'] },
  valve: { id: 'valve', name: 'Valve', emoji: '🚿', recipe: ['pipe', 'lever'] },
  relay: { id: 'relay', name: 'Relay', emoji: '📡', recipe: ['coil', 'switch'] },
  sensor: { id: 'sensor', name: 'Sensor', emoji: '📶', recipe: ['filament', 'glass'] },
  gearbox: { id: 'gearbox', name: 'Gearbox', emoji: '📦', recipe: ['crankshaft', 'gear'] },

  // ===== Layer 12 - Advanced Mechanisms =====
  actuator: { id: 'actuator', name: 'Actuator', emoji: '🦾', recipe: ['motor', 'lever'] },
  hydraulics: { id: 'hydraulics', name: 'Hydraulics', emoji: '💧', recipe: ['pump', 'tube'] },
  circuit: { id: 'circuit', name: 'Circuit', emoji: '🔋', recipe: ['relay', 'wire'] },
  pneumatics: { id: 'pneumatics', name: 'Pneumatics', emoji: '💨', recipe: ['pump', 'valve'] },
  transmission: { id: 'transmission', name: 'Transmission', emoji: '🔧', recipe: ['gearbox', 'drivetrain'] },

  // ===== Layer 13 - Complex Assemblies =====
  servo: { id: 'servo', name: 'Servo', emoji: '🎯', recipe: ['actuator', 'circuit'] },
  cylinder: { id: 'cylinder', name: 'Cylinder', emoji: '🛢️', recipe: ['hydraulics', 'piston'] },
  controller: { id: 'controller', name: 'Controller', emoji: '🎮', recipe: ['circuit', 'sensor'] },
  conveyor: { id: 'conveyor', name: 'Conveyor', emoji: '🛤️', recipe: ['motor', 'chain'] },
  gripper: { id: 'gripper', name: 'Gripper', emoji: '🤏', recipe: ['hydraulics', 'clamp'] },

  // ===== Layer 14 - Robotic Components =====
  robot_joint: { id: 'robot_joint', name: 'Robot Joint', emoji: '🦿', recipe: ['servo', 'bearing'] },
  arm_segment: { id: 'arm_segment', name: 'Arm Segment', emoji: '📏', recipe: ['robot_joint', 'rod'] },
  logic_unit: { id: 'logic_unit', name: 'Logic Unit', emoji: '🧠', recipe: ['controller', 'circuit'] },
  power_supply: { id: 'power_supply', name: 'Power Supply', emoji: '🔌', recipe: ['coil', 'circuit'] },
  frame: { id: 'frame', name: 'Frame', emoji: '🖼️', recipe: ['bracket', 'steel'] },

  // ===== Layer 15 - Mechanical Arm (MACHINE) =====
  mechanical_arm: { id: 'mechanical_arm', name: 'Mechanical Arm', emoji: '🦾', recipe: ['arm_segment', 'gripper'], machine: true },

  // ===== Layer 16 - Advanced Electronics =====
  processor: { id: 'processor', name: 'Processor', emoji: '💻', recipe: ['logic_unit', 'filament'] },
  transformer: { id: 'transformer', name: 'Transformer', emoji: '🔌', recipe: ['coil', 'coil'] },
  capacitor: { id: 'capacitor', name: 'Capacitor', emoji: '🔋', recipe: ['foil', 'circuit'] },
  resistor: { id: 'resistor', name: 'Resistor', emoji: '➖', recipe: ['wire', 'charcoal'] },
  amplifier: { id: 'amplifier', name: 'Amplifier', emoji: '📢', recipe: ['transformer', 'circuit'] },

  // ===== Layer 17 - Computing =====
  computer: { id: 'computer', name: 'Computer', emoji: '🖥️', recipe: ['processor', 'circuit'] },
  generator: { id: 'generator', name: 'Generator', emoji: '⚡', recipe: ['engine', 'coil'] },
  memory: { id: 'memory', name: 'Memory', emoji: '💾', recipe: ['capacitor', 'logic_unit'] },
  interface: { id: 'interface', name: 'Interface', emoji: '🖱️', recipe: ['sensor', 'controller'] },
  power_core: { id: 'power_core', name: 'Power Core', emoji: '🔆', recipe: ['generator', 'capacitor'] },

  // ===== Layer 17 - Advanced Computing =====
  quantum_core: { id: 'quantum_core', name: 'Quantum Core', emoji: '💠', recipe: ['computer', 'plasma'] },

  // ===== Layer 18 - Elemental Accumulator (MACHINE) =====
  accumulator: { id: 'accumulator', name: 'Accumulator', emoji: '🏭', recipe: ['quantum_core', 'generator'], machine: true },
};
