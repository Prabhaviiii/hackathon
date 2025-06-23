const languageSwitcher = document.getElementById('languageSwitcher');
let translations = { };



function loadLanguage(lang){
    fetch(`${lang}.json`)
    .then(response=>response.json())
    .then(data=>{
        translations=data;
        updatePageText();


    });

}
function updatePageText(){
    document.querySelector('[data-i18n]').forEach(el => {
        const key =el.getAttribute('data-i18n');
        if(translations[key]){
            el.textContent=translations[key];
        }
    });

}

loadLanguage('en');

languageSwitcher.addEventListener('change',()=>{
    const selectedLang= languageSwitcher.value;
    loadLanguage(selectedLang);
}

);