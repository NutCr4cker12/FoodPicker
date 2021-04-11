const formatDate = oDate => {
    let date = new Date(oDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${day}.${month}`
}

const createDefaultContent = payments => {
    let paymentText = "";
    payments.forEach(p => {
        paymentText += `${p.notes}, ${p.amount}€, eräpäivä: ${formatDate(p.date)} (${p.imageName})\n`;
    })
    return `Hei,\n\nLiitteenä taas laskuja:\n\n${paymentText}\nTerveisin,\nKimi Heinonen\n`
}

export const openOnMail = (payments) => {
    let from = process.env.REACT_APP_MAIL_FROM;
    let to = process.env.REACT_APP_MAIL_TO;
    let title = "Laskuja";
    let content = createDefaultContent(payments);
    window.open(`mailto:${to}?subject=${title}&body=${encodeURIComponent(content)}`);
}