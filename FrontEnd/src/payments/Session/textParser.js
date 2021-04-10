
const FIND_MAP = {
    "viitenumero": "viite",
    "viite": "viite",
    "fi01": "iban"
}


export const parseImageResult = data => {
    const result = {
        viite: { result: "", confidence: 0},
        iban: { result: "", confidence: 0},
        saaja: { result: "", confidence: 0},
        euro: { result: 0, confidence: 0},
        dueDate: { result: new Date, confidence: 0},
    };

    const tryFindViite = line => {
        
    }
    
    const tryFindIBAN = line => {
        
    }

    const tryFindSaaja = line => {

    }

    const tryFindAmount = line => {

    }

    const tryFindDueDate = line => {

    }

    data.lines.forEach(line => {
        line = line.toLowerCase()
        tryFindViite(line);
    });

    const res = {}
    Object.keys(result).forEach(k => res[k] = result[k].result)
    return res
}