let translators = {
  data: {
    "MK": "М.Н. Кожевникова",
    "AKT": "А. Кугявичус - А.А. Терентьев",
    "ZAG": "Б.И. Загуменнов",
    "DON": "А.М. Донец",
    "HOP": "J. Hopkins",
    "BRZ": "A. Berzin"
  },

  getTranslator(token) {
    return this.data[token] || "unknown"
  }
}

export default translators
