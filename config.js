const CONFIG = {
    "init": "if(!localStorage.learned_count) localStorage.learned_count = 0;",
    "data": {
        "consonants": [
            { id: "c1", char: "ก", name: "Kor Kai", meaning: "鶏 (Chicken)", class: "mid", sound: "k" },
            { id: "c2", char: "ข", name: "Khor Khai", meaning: "卵 (Egg)", class: "high", sound: "kh" },
            { id: "c3", char: "ฃ", name: "Khor Khuat", meaning: "瓶 (Bottle)", class: "high", sound: "kh" },
            { id: "c4", char: "ค", name: "Khor Khwai", meaning: "水牛 (Buffalo)", class: "low", sound: "kh" },
            { id: "c5", char: "ฅ", name: "Khor Khon", meaning: "人 (Person)", class: "low", sound: "kh" },
            { id: "c6", char: "ฆ", name: "Khor Rakhang", meaning: "鐘 (Bell)", class: "low", sound: "kh" },
            { id: "c7", char: "ง", name: "Ngor Ngu", meaning: "蛇 (Snake)", class: "low", sound: "ng" },
            { id: "c8", char: "จ", name: "Chor Chan", meaning: "皿 (Plate)", class: "mid", sound: "ch" },
            { id: "c9", char: "ฉ", name: "Chor Ching", meaning: "シンバル (Cymbals)", class: "high", sound: "ch" },
            { id: "c10", char: "ช", name: "Chor Chang", meaning: "象 (Elephant)", class: "low", sound: "ch" }
        ],
        "vowels": [
            {"id": "v1", "char": "ะ", "name": "Sara A", "type": "short", "sound": "a"},
            {"id": "v2", "char": "า", "name": "Sara Aa", "type": "long", "sound": "aa"}
        ]
    },
    "screens": [
        {
            "id": "home",
            "title": "タイ語学習",
            "components": [
                {"type": "text_display", "value": "学習を始めましょう", "size": "medium"},
                {"type": "button", "label": "文字を覚える", "action": "navigate:study"},
                {"type": "button", "label": "文字一覧を見る", "action": "navigate:library"},
                {"type": "button", "label": "クイズに挑戦", "action": "navigate:quiz"}
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
            "on_load": "pick_random_char",
            "components": [
                {"type": "text_display", "value": "current_char.char", "size": "large"},
                {"type": "text_display", "value": "current_char.name", "size": "small"},
                {"type": "text_display", "value": "current_char.meaning", "size": "small"},
                {"type": "button", "label": "再生", "action": "speak:current_char.name"},
                {"type": "button", "label": "次へ", "action": "pick_random_char"}
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
