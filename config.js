const CONFIG = {
    "version": "1.2.1",
    "init": "if(!localStorage.learned_count) localStorage.learned_count = 0;",
    "data": {
        "consonants": [
            { id: "c1", char: "ก", name: "Kor Kai", sound: "k", class: "mid", meaning: "鶏" },
            { id: "c2", char: "ข", name: "Khor Khai", sound: "kh", class: "high", meaning: "卵" },
            { id: "c3", char: "ฃ", name: "Khor Khuat", sound: "kh", class: "high", meaning: "瓶" },
            { id: "c4", char: "ค", name: "Khor Khwai", sound: "kh", class: "low", meaning: "水牛" },
            { id: "c5", char: "ฅ", name: "Khor Khon", sound: "kh", class: "low", meaning: "人" },
            { id: "c6", char: "ฆ", name: "Khor Rakhang", sound: "kh", class: "low", meaning: "鐘" },
            { id: "c7", char: "ง", name: "Ngor Ngu", sound: "ng", class: "low", meaning: "蛇" },
            { id: "c8", char: "จ", name: "Chor Chan", sound: "ch", class: "mid", meaning: "皿" },
            { id: "c9", char: "ฉ", name: "Chor Ching", sound: "ch", class: "high", meaning: "シンバル" },
            { id: "c10", char: "ช", name: "Chor Chang", sound: "ch", class: "low", meaning: "象" },
            { id: "c11", char: "ซ", "name": "Sor So", "sound": "s", "class": "low", "meaning": "鎖" },
            { id: "c12", char: "ฌ", "name": "Chor Choe", "sound": "ch", "class": "low", "meaning": "木" },
            { id: "c13", char: "ญ", "name": "Yor Ying", "sound": "y", "class": "low", "meaning": "女性" },
            { id: "c14", char: "ฎ", "name": "Dor Chada", "sound": "d", "class": "mid", "meaning": "冠" },
            { id: "c15", char: "ฏ", "name": "Tor Patak", "sound": "t", "class": "mid", "meaning": "突き棒" },
            { id: "c16", char: "ฐ", "name": "Thor Than", "sound": "th", "class": "high", "meaning": "台座" },
            { id: "c17", char: "ฑ", "name": "Thor Montho", "sound": "th", "class": "low", "meaning": "モントー夫人" },
            { id: "c18", char: "ฒ", "name": "Thor Phuthao", "sound": "th", "class": "low", "meaning": "老人" },
            { id: "c19", char: "ณ", "name": "Nor Nen", "sound": "n", "class": "low", "meaning": "新米僧" },
            { id: "c20", char: "ด", "name": "Dor Dek", "sound": "d", "class": "mid", "meaning": "子供" },
            { id: "c21", char: "ต", "name": "Tor Tao", "sound": "t", "class": "mid", "meaning": "亀" },
            { id: "c22", char: "ถ", "name": "Thor Thung", "sound": "th", "class": "high", "meaning": "袋" },
            { id: "c23", char: "ท", "name": "Thor Thahan", "sound": "th", "class": "low", "meaning": "兵士" },
            { id: "c24", char: "ธ", "name": "Thor Thong", "sound": "th", "class": "low", "meaning": "旗" },
            { id: "c25", char: "น", "name": "Nor Nu", "sound": "n", "class": "low", "meaning": "鼠" },
            { id: "c26", char: "บ", "name": "Bor Baimai", "sound": "b", "class": "mid", "meaning": "葉" },
            { id: "c27", char: "ป", "name": "Por Pla", "sound": "p", "class": "mid", "meaning": "魚" },
            { id: "c28", char: "ผ", "name": "Phor Phueng", "sound": "ph", "class": "high", "meaning": "蜂" },
            { id: "c29", char: "ฝ", "name": "For Fa", "sound": "f", "class": "high", "meaning": "蓋" },
            { id: "c30", char: "พ", "name": "Phor Phan", "sound": "ph", "class": "low", "meaning": "トレイ" },
            { id: "c31", char: "ฟ", "name": "For Fan", "sound": "f", "class": "low", "meaning": "歯" },
            { id: "c32", char: "ภ", "name": "Phor Samphao", "sound": "ph", "class": "low", "meaning": "帆船" },
            { id: "c33", char: "ม", "name": "Mor Ma", "sound": "m", "class": "low", "meaning": "馬" },
            { id: "c34", char: "ย", "name": "Yor Yak", "sound": "y", "class": "low", "meaning": "鬼" },
            { id: "c35", char: "ร", "name": "Ror Ruea", "sound": "r", "class": "low", "meaning": "船" },
            { id: "c36", char: "ล", "name": "Lor Ling", "sound": "l", "class": "low", "meaning": "猿" },
            { id: "c37", char: "ว", "name": "Wor Waen", "sound": "w", "class": "low", "meaning": "指輪" },
            { id: "c38", char: "ศ", "name": "Sor Sala", "sound": "s", "class": "high", "meaning": "東屋" },
            { id: "c39", char: "ษ", "name": "Sor Ruesi", "sound": "s", "class": "high", "meaning": "仙人" },
            { id: "c40", char: "ส", "name": "Sor Suea", "sound": "s", "class": "high", "meaning": "虎" },
            { id: "c41", char: "ห", "name": "Hor Hip", "sound": "h", "class": "high", "meaning": "箱" },
            { id: "c42", char: "ฬ", "name": "Lor Chula", "sound": "l", "class": "low", "meaning": "凧" },
            { id: "c43", char: "อ", "name": "Or Ang", "sound": "o", "class": "mid", "meaning": "盆" },
            { id: "c44", char: "ฮ", "name": "Hor Nok-huk", "sound": "h", "class": "low", "meaning": "梟" }
        ],
        "vowels": [
            { "id": "v1", "char": "ะ", "name": "Sara A", "type": "short", "sound": "a" },
            { "id": "v2", "char": "า", "name": "Sara Aa", "type": "long", "sound": "aa" },
            { "id": "v3", "char": "ิ", "name": "Sara I", "type": "short", "sound": "i" },
            { "id": "v4", "char": "ี", "name": "Sara Ii", "type": "long", "sound": "ii" },
            { "id": "v5", "char": "ึ", "name": "Sara Ue", "type": "short", "sound": "ue" },
            { "id": "v6", "char": "ื", "name": "Sara Uee", "type": "long", "sound": "uee" },
            { "id": "v7", "char": "ุ", "name": "Sara U", "type": "short", "sound": "u" },
            { "id": "v8", "char": "ู", "name": "Sara Uu", "type": "long", "sound": "uu" }
        ]
    },
    "screens": [
        {
            "id": "home",
            "title": "Thai Study",
            "components": [
                {"type": "text_display", "value": "学習を始めましょう", "size": "medium"},
                {"type": "button", "label": "文字を覚える", "action": "pick_random_char; navigate:study"},
                {"type": "button", "label": "書き取り練習", "action": "pick_random_char; navigate:trace"},
                {"type": "button", "label": "文字一覧を見る", "action": "navigate:library"},
                {"type": "button", "label": "クイズに挑戦", "action": "navigate:quiz"},
                {"type": "text_display", "value": "v1.2.1", "size": "small"}
            ]
        },
        {
            "id": "trace",
            "title": "書き取り",
            "components": [
                {"type": "text_display", "value": "current_char.char", "size": "large"},
                {"type": "trace_canvas", "target": "current_char.char"},
                {"type": "button", "label": "ランダムに次へ", "action": "pick_random_char"}
            ]
        },
        {
            "id": "library",
            "title": "文字一覧",
            "components": [
                {"type": "char_grid", "data": "consonants", "action": "navigate:study"}
            ]
        },
        {
            "id": "study",
            "title": "文字学習",
            "components": [
                {"type": "text_display", "value": "current_char.char", "size": "large"},
                {"type": "text_display", "value": "current_char.name", "size": "small"},
                {"type": "text_display", "value": "current_char.meaning", "size": "small"},
                {"type": "button", "label": "ランダムに次へ", "action": "pick_random_char"}
            ]
        },
        {
            "id": "quiz",
            "title": "4択クイズ",
            "on_load": "pick_random_char; generate_options",
            "components": [
                {"type": "text_display", "value": "current_char.char", "size": "large"},
                {"type": "button_group", "options": "quiz_options", "target": "current_char.sound", "validate": "validate_quiz"}
            ]
        }
    ]
};
