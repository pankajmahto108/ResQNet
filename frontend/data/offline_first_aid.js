
export const offlineFirstAidData = [
    {
        id: 'cpr',
        title: 'CPR (Cardiopulmonary Resuscitation)',
        keywords: ['cpr', 'heart attack', 'unconscious', 'no breathing'],
        severity: 'HIGH',
        steps: [
            "Check for responsiveness and breathing.",
            "Call emergency services immediately.",
            "Place hands on the center of the chest.",
            "Push hard and fast (100-120 compressions per minute).",
            "Allow chest to recoil completely between compressions."
        ],
        image: "/images/first_aid/cpr.jpg"
    },
    {
        id: 'burns',
        title: 'Burns & Scalds',
        keywords: ['burn', 'fire', 'hot water', 'steam'],
        severity: 'MODERATE',
        steps: [
            "Cool the burn under cool running water for at least 20 minutes.",
            "Remove tight clothing or jewelry near the burn.",
            "Cover with a sterile, non-fluffy dressing or cling film.",
            "Do NOT apply ice, creams, or burst blisters."
        ],
        image: "/images/first_aid/burns.jpg"
    },
    {
        id: 'bleeding',
        title: 'Heavy Bleeding',
        keywords: ['cut', 'blood', 'wound', 'hemorrhage'],
        severity: 'HIGH',
        steps: [
            "Apply direct pressure to the wound with a clean cloth.",
            "Elevate the injured limb above heart level.",
            "Keep pressure applied until bleeding stops.",
            "Bandage firmly but not too tight to stop circulation."
        ],
        image: "/images/first_aid/bleeding.jpg"
    },
    {
        id: 'choking',
        title: 'Choking (Heimlich Maneuver)',
        keywords: ['choking', 'blocked throat', 'food stuck'],
        severity: 'HIGH',
        steps: [
            "Stand behind the person and lean them slightly forward.",
            "Make a fist and place it just above their navel.",
            "Grasp your fist with the other hand.",
            "Press hard into the abdomen with a quick, upward thrust."
        ],
        image: null // No image provided for choking
    },
    {
        id: 'fracture',
        title: 'Fracture / Broken Bone',
        keywords: ['break', 'bone', 'fracture', 'pain'],
        severity: 'MODERATE',
        steps: [
            "Immobilize the injured area. Do not try to realign bone.",
            "Apply ice packs wrapped in cloth to reduce swelling.",
            "Stop any bleeding if present.",
            "Keep the person still and calm until help arrives."
        ],
        image: "/images/first_aid/fracture.jpg"
    }
];
