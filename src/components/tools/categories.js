const SONYC_CATEGORIES = [
  {
    key: "1_engine_presence",
    name: "Engines",
    children: [
      {key: "1-1_small-sounding-engine_presence", name: "Small engine"},
      {key: "1-2_medium-sounding-engine_presence", name: "Medium engine"},
      {key: "1-3_large-sounding-engine_presence", name: "Large engine"},
      {key: "1-X_engine-of-uncertain-size_presence", name: "Engine of uncertain size"}
    ]
  },
  {
    key: "2_machinery-impact_presence",
    name: "Machinery",
    children: [
      {key: "2-1_rock-drill_presence", name: "Rock drill"},
      {key: "2-2_jackhammer_presence", name: "Jackhammer"},
      {key: "2-3_hoe-ram_presence", name: "Hoe ram"},
      {key: "2-4_pile-driver_presence", name: "Pile driver"},
      {key: "2-X_other-unknown-impact-machinery_presence", name: "Other or unknown machinery"}
    ]
  },
  {
    key: "3_non-machinery-impact_presence",
    name: "Non machinery",
    children: [
      {key: "3-1_non-machinery-impact_presence", name: "Non-machinery"}
    ]
  },
  {
    key: "4_powered-saw_presence",
    name: "Powered saw",
    children: [
      {key: "4-1_chainsaw_presence", name: "Chainsaw"},
      {key: "4-2_small-medium-rotating-saw_presence", name: "Small/medium saw"},
      {key: "4-3_large-rotating-saw_presence", name: "Large saw"},
      {key: "4-X_other-unknown-powered-saw_presence", name: "Other"}
    ]
  },
  {
    key: "5_alert-signal_presence",
    name: "Alert signals",
    children: [
      {key: "5-1_car-horn_presence", name: "Car horn"},
      {key: "5-2_car-alarm_presence", name: "Car alarm"},
      {key: "5-3_siren_presence", name: "Siren"},
      {key: "5-4_reverse-beeper_presence", name: "Reverse beeper"},
      {key: "5-X_other-unknown-alert-signal_presence", name: "Other or unknown"}
    ]
  },
  {
    key: "6_music_presence",
    name: "Music",
    children: [
      {key: "6-1_stationary-music_presence", name: "Stationary music"},
      {key: "6-2_mobile-music_presence", name: "Mobile music"},
      {key: "6-3_ice-cream-truck_presence", name: "Ice cream truck"},
      {key: "6-X_music-from-uncertain-source_presence", name: "Uncertain source"}
    ]
  },
  {
    key: "7_human-voice_presence",
    name: "Voices",
    children: [
      {key: "7-1_person-or-small-group-talking_presence", name: "Person or small group talking"},
      {key: "7-2_person-or-small-group-shouting_presence", name: "Person or small group shouting"},
      {key: "7-3_large-crowd_presence", name: "Large crowd"},
      {key: "7-4_amplified-speech_presence", name: "Amplified speech"},
      {key: "7-X_other-unknown-human-voice_presence", name: "Other human voice"}
    ]
  },
  {
    key: "8_dog_presence",
    name: "Dog",
    children: [
      {key: "8-1_dog-barking-whining_presence", name: "Dog barking/whining"}
    ]
  }
];

export default SONYC_CATEGORIES;