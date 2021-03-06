const { Descriptions } = require('./helpers/descriptions.js');
const { Pages } = require('./helpers/pages.js');

const users = [
  { id: 'AKT', body: { description: '/pages/AKT' } },
  { id: 'MK', body: { description: '/pages/MK' } }
];

const pages = [{
  url: 'AKT',
  title: 'А. Кугявичус - А.А. Терентьев',
  text: `
<p>
<a href="/pages/AK">А. Кугявичус</a>
<br>
<a href="/pages/AAT">А.А. Терентьев</a>
</p>
`
}, {
  url: 'AAT',
  title: 'А.А. Терентьев',
  text: `
<p>
Андрей Анатольевич Терентьев родился в Ленинграде, в 1948 г. В 1975 году
закончил Философский факультет ЛГУ, где изучал историю индийской философии,
санскрит и тибетский языки, после окончания университета стал младшим научным
сотрудником Музея истории религии и атеизма. Его основной специализацией стала
буддийская иконография: к 1980 году он создал эффективную систему определения
буддийских изображений. В 1983 г. защитил кандидатскую диссертацию в Институте
востоковедения АН СССР (Москва).
</p>
<p>
С началом Перестройки Терентьев стал одним из организаторов Ленинградского
общества буддистов, которое сумело вернуть буддистам знаменитый Петербургский
буддийский храм; впоследствии он был организатором и бессменным Секретарем Санкт-
Петербургского союза буддистов, объединявшего буддийские группы в городе.
<p>
В 1990-е гг. А. Терентьев был личным переводчиком Его Святейшества Далай-
ламы во время всех его визитов в Россию, а впоследствии также в Латвию и Литву.
</p>
<p>
Основал первое в РФ буддийское издательство — «Нартанг». Был редактором и
издателем впервые полностью переведённого на русский язык трактата Чже Цонкапы
«Ламрим Ченмо». Является главным редактором журнала «Буддизм России». Им
опубликовано более 100 статей и книг.
</p>
`
}, {
  url: 'MK',
  title: 'М.Н. Кожевникова',
  text: `
<p>
Маригарита Николаевна Кожевникова — тибетолог, буддолог, переводчик, поэт-писатель и
философ. Родилась в г. Новосибирске, окончила Новосибирский Университет, гуманитарный
факультет, где специализировалась на литературоведении, японистике. Защитила кандидатскую
диссертацию по теме «Философия образования в буддийской традиции» на Философском
факультете СПбГУ.
</p>
<p>
Тибетский язык и буддийскую философию изучала самостоятельно в Дхарамсале (Индия) в
Библиотеке тибетских трудов и архивов (LTWA).
<p>
Переводчик с тибетского и английского языков текстов по буддизму и лекций разных
буддийских учителей (с 2003 г. является постоянным переводчиком учений в Санкт-Петербурге,
Москве и Литве геше-лхарамбы Дакпы Джампы).
</p>
<p>
В 1993—2012 гг. была сотрудником филиала ИИЕТ РАН в Санкт-Петербурге, группы
истории исследований Центральной Азии, активно участвовала в создании Музея-квартиры
путешественника П.К. Козлова.
</p>
<p>
Автор 7 книг и более 60 статей по буддизму: по истории буддологии, современной истории
буддизма в России, буддийской философии и практике.
</p>
<p>
Автор работ по философии образования.
</p>
`
}];


const script = {
  title: `Add MK and AKT descriptions`,
  run: (client) =>
    Descriptions.run(client, users)
    .then(Pages.run(client, pages))
};

module.exports = script;
