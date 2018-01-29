const config = require('../config.js');

const pages = [{
  url: 'about',
  title: 'Цели проекта',
  text: `
<p>
Сегодня в России имеет хождение большое количество буддийских текстов, и публикуются новые и новые книги,
выкладываются Интернет-публикации, звучат устные переводы лекций. В 1990-м году, когда вышла в свет первая
собственно буддийская (не научная, буддологическая) книга – тонкая брошюра "Буддизм Тибета" Далай-ламы,
трудно было даже представить, как быстро и широко пойдет этот процесс. И вместе с тем мы оказываемся очевидцами
зарождающегося русского буддийского языка и российской буддийской культуры.
Однако для читателей буддийских книг этот период – это, в определенном смысле, и период испытаний.
Ведь русский буддийский язык еще не сложился, он отнюдь не так уж хорош и красив, полон непереведенных слов
из санскрита и тибетского. Ещё одна особенность - терминологическое разнообразие - разные переводчики используют разные
русские слова для перевода терминов, - и читатели порой с трудом догадываются, как соответствуют слова одного текста словам
другого, если переводы этих текстов делались разными переводчиками.
</p>

<p>
Наш проект посвящен именно этой проблематике – представлению буддийской терминологии в разнообразии ее переводов на русский язык.
В нашем словаре мы будем пытаться показать максимальное количество вариантов перевода термина разными переводчиками, что должно послужить
нескольким целям. Во-первых, облегчить понимание термина читателями. Термин будет как бы «подсвечен» с разных сторон вариантами
перевода разных авторов. Во-вторых, помочь переводчикам в поиске подходящего русского термина.
</p>

<p>
Мы также даём возможность авторам переводов давать произвольный комментарий для данного значения термина. Например, почему выбран
именно такой перевод, или как автор толкует термин, или в каком контексте автор предлагает переводить термин данным образом и т.д.
Это также способствует лучшему пониманию тибетской терминологии читателями.
</p>

<p>
В настоящее время в статье к термину представлена следующая информация:
<ul>
<li>Собственно тибетский термин в транскрипции Wylie</li>
<li>Эквивалентный термин на санскрите представлен в русской транскрипции</li>
<li>Варианты перевода термина на русский язык разными переводчиками (с авторскими комментариями)</li>
<li>Перевод термина на английский язык по словарю J.Hopkins (в дальнейшем мы планируем добавить переводы A.Berzin, и, возможно, других переводчиков)</li>
</ul>
</p>

<p>
На сегодняшний день на сайте проекта представлены варианты перевода тибетских терминов на русский язык используемые/разработанные
следующими переводчиками:

<ul>
<li><a href="/pages/DON">А.М. Донец</a> (по изданию "Введение в Мадхьямику" Чандракирти)</li>
<li><a href="/pages/ZAG">Б.И. Загуменнов</a> (по глоссарию с сайта переводчика)</li>
<li><a href="/pages/MK">М.Н. Кожевникова</a> (по глоссарию предоставленному переводчиком в электронном виде)</li>
<li><a href="/pages/AKT">А. Кугявичус и А.А. Терентьев</a> (по предоставленной переводчиками, электронной версии индексов к "Большому руководству к этапам Пути Пробуждения" Чже Цонкапы)</li>
<li><a href="/pages/HOP">J. Hopkins</a></li>
<li><a href="/pages/BRZ">A. Berzin</a></li>
<li><a href="/pages/MM">М. Малыгина</a></li>
<li><a href="/pages/RAG">В.К. Рагимов</a></li>
<li><a href="/pages/JRK">Ю. Жиронкина</a></li>
</ul>

</p>

<p>
Если Вы - переводчик, и хотите чтобы ваш вариант терминологии был представлен на сайте проекта, пожалуйста, свяжитесь с нами по адресу:
<a href="mailto:dictionary@aryadeva.spb.ru">dictionary@aryadeva.spb.ru</a>
</p>

<h3>Как пользоваться словарем</h3>
<p>
Тут всё просто как Google! В строке поиска набираете слово (или слова) которые вы хотите найти в нашем словаре. Слова можно вводить:
<ul>
<li>
  на английском - для поиска термина по транскрипции Wylie или санскриту в английской транскрипции
</li>
<li>
  на русском языке  - для поиска терминов в чьих переводах встречаются введенные вами слова
</li>
</ul>

Теперь нажимаете кнопку [Найти] (или [Enter] на клавиатуре) и видите результаты поиска: слева список терминов в которых встречается слово (слова)
которые вы искали, справа - описание термина который сейчас выбран в списке слева. Для выбора другого термина в списке, просто "кликните" по нему.
</p>

<h3>Ближайшие перспективы</h3>
<p>
Как мы планируем развивать проект:
<ul>
<li>Наша постоянная задача - расширять круг охватываемой терминологии, как по горизонтали - добавлять новые термины в словарь,
    так и по вертикали - добавлять варианты перевода представленных терминов всё большим количеством переводчиков</li>
<li>Дать возможность переводчикам редактировать <em>свои</em> переводы и комментарии к ним прямо на сайте (после авторизации)</li>
</ul>
</p>

<h3>Помощь проекту</h3>
<p>
Вы можете помочь проекту став его участником! Мы ищем:
<ul>
<li>
Волонтеров: программистов, дизайнеров, знатоков тибетского. Но главное, нам нужны люди готовые помогать проекту в главном -
наполнять его переводами. Другими словами, "извлекать" переводы терминов из доступных нам источников авторской терминологии -
индексов в книгах, глоссариев, аудио-видео записей учений и т.д. Эту работу вы сможете проделывать, даже если не знаете тибетского
языка (пока).
</li>
<li>
Координаторов проекта. Людей, которые помогать держать связь с волонтерами и переводчиками, обсуждать куда и как развивать проект.
</li>
<li>
Нам нужны эксперты-филологи. Люди, которые смогут профессионально отвечать на возникающие у нас вопросы, связанные с тибетским языком.
</li>
</ul>
</p>

<p>
У вас появилась идея как сделать проект полезнее/удобнее/интереснее? Вы обнаружили проблему на сайте?
А может быть просто хотите поделиться своими впечатлениями. Пишите нам: <a href="mailto:dictionary@aryadeva.spb.ru">dictionary@aryadeva.spb.ru</a>
</p>

<p>
Наконец, что касается финансовой помощи проекту. Вся работа над проектом осуществляется бесплатно - силами волонтеров. Единственная
статья расходов на сегодняшний день - оплата Веб хостинга. Тем не менее, эти минимальные деньги тоже нужны, а кроме того,
дополнительные средства позволили бы нам нанимать профессиональных программистов, что дало бы возможность развивать сайт проекта
значительно быстрее. Итак, если вы готовы помочь проекту финансово, нажмите сюда: [Здесь будет кнопка]
</p>

<p>
Всех благ и скорейшего Просветления (или <em>Пробуждения</em>? смотрите в нашем словаре),
</p>

<p>
Команда проекта "Буддийская терминология в русских переводах"
</p>`
}, {
  url: 'DON',
  title: 'А.М. Донец',
  text: `
<pre>Донец Андрей Михайлович доктор исторических наук, ведущий
научный сотрудник Отдела философии, культурологии и религиоведения
ИМБТ СО РАН (Улан-Удэ). Окончил факультет психологии Ленинградского
государственного университета (1976 г.). В 1999 г. становится научным
сотрудником Отдела философии, культурологии и религиоведения ИМБТН
СО РАН; с 2001 г. - старший научным сотрудник Отдела философии,
культурологии и религиоведения ИМБТН СО РА; с 2007 г. - ведущий
научным сотрудник Отдела философии, культурологии и религиоведения
ИМБТ СО РАН. Основные научные интересы касаются традиционной
системы образования в буддийских монастырях Центральной Азии,
схоластики, буддологии, истории буддизма, источниковедения, мадхъямики,
традиции Гелуг. Владеет тибетским и английским языками. Перевел с
тибетского языка Сутру «Поучения Вималакирти» [отв. ред.: С. П.
Нестеркин]; Ин-т монголоведения, буддологии и тибетологии СО РАН. Улан-
Удэ, 2005. Основные публикации: Доктрина зависимого возникновения в
тибето-монгольской схоластике. – Улан-Удэ: БНЦ СО РАН, 2004; Учение о
верном познании в философии мадхьямики-прасангики. – Улан-Удэ: БНЦ СО
РАН, 2006; Буддийское учение о медитативных состояниях в дацанской
литературе. – Улан-Удэ: БНЦ СО РАН, 2007; Проблемы базового сознания и
реальности внешнего в дацанской философии. – Улан-Удэ: БНЦ СО РАН,
2008; Герменевтика буддизма. – Улан-Удэ: БНЦ СО РАН, 2006. (В
соавторстве с Лепеховым С.Ю., Нестеркиным С.П.). – С. 85-172.</pre>`
}, {
  url: 'HOP',
  title: 'J. Hopkins',
  text: `
<pre>Он опубликовал 42 книги, был переводчиком Его Святейшества Далай-ламы
и вел продолжительную преподавательскую практику, обучая тибетскому
буддизму многих выдающихся ученых и переводчиков. Директор Центра
южноазиатских исследований Университета Вирджинии в течение
двенадцати лет: 1979-82, 1985-1994 годы.
Президент Института азиатской демократии, Вашингтон - 1994-2000.
Официальный переводчик на лекционных турах для Его Святейшества
Далай-ламы в США в 1979, 1981, 1984, 1987, 1989 и 1996 годах; в Канаде в
1980 году; в Юго-Восточной Азии и Австралии в 1982 году; в
Великобритании в 1984 году; и в Швейцарии в 1985 году.</pre>`
}, {
  url: 'MM',
  title: 'М. Малыгина',
  text: `
<pre>В 1992 году окончила Московский государственный лингвистический университет
 в Москве, с 1994 года занимается  переводами буддийской литературы и устными
переводами буддийских учений (с английского языка на русский). Издано более
30 буддийских книг в ее переводах. Являлась синхронным переводчиком Его
Святейшества Далай-ламы с 1998 г. по 2014 гг. Начиная с 2014 года также устно
переводит буддийские учения и с тибетского языка.</pre>`
}, {
  url: 'RAG',
  title: 'В.К. Рагимов',
  text: `
<pre>Занимается переводами буддийских текстов с 1988 года: с английского,
немецкого и тибетского языка. С 1988 по 2008 г. переводил тексты
Ламы Оле Нидала с английского и немецкого языков. Переводит тексты
буддийских традиций Кагью, Ньингма, Бон и Джонангпа, а также по дзен-
буддизму. Многие из переводов изданы, например: Лиллиан Ту
«Книга о Буддах» / пер. с англ. Киев, 2008; Таранатха « Источник Амриты,
ступени наставлений для людей трех типов, вступающих на путь
учения Будды» / пер. с тиб. М., 2013. В последние 10 лет в основном
переводит с тибетского языка. Осуществляет также устные переводы учителей.

Основные принципы перевода терминов:
  1. Не думаю, что возможно прийти к жесткому единообразию, и не вижу в
этом проблемы. К одному тибетскому термину нет необходимости привязывать
именно один какой-то перевод, но лучше обозначить ряд возможных переводов,
применимых в различных ситуациях – в зависимости от стиля текста, стиля
перевода, контекста и т.д.
  2. Некоторые термины, полагаю, лучше оставить на санскрите или даже на
тибетском, не пытаться обязательно перевести.
  3. У нескольких тибетских терминов может совпадать перевод ввиду
несовпадения семантических рядов, а также см. пункт 1.</pre>`
}, {
  url: 'AK',
  title: 'Альгирдас Кугявичус',
  text: `
Альгирдас Кугявичус, переводчик буддийской литературы  (родился в 1954 г. в г. Каунас).
В 70-е годы на будущего переводчика оказывают большое влияние ряд книг: жизнеописание Миларепы, жизнеописание Падмасамбхавы, «Тайные доктрины [Наропы]» и «Тибетская книга мертвых»,  а также  ряд работ отечественных буддологов Ф.И. Щербатского и О.О. Розенберга.
В течение 1979-1982 гг. получает учения от своего коренного учителя Гомбо Бадмаевича Цыбикова в Агинском дацане. Тибетский язык изучал в основном самостоятельно, грамматику осваивал с помощью учебника Юрия Рериха «Тибетский язык», а при непонимании сложных мест обращался к ламе Алдару с вопросами. От него же начал получать первую информацию по философии буддизма.
В 1994, 1995, 1997, 1998 и 2000 гг. последовательно выходят пять томов «Ламрим Ченмо» в его переводе. И в тоже время он продолжает заниматься переводами классических буддийских текстов на русский и литовский языки.

Основные переводы на русском языке:
<ul>
<li>Сутра золотистого света (Арья Суварнапрабхаса уттама сутра) / Пер. с тиб. А. Кугявичус. — 2005.</li>
<li>Двойная сутра. (Арья Сангхата-сутра) / Пер. с тиб. А. Кугявичуса. — 2006.</li>
<li>Донг Лобсан Даргье. Путь блистательного мудреца (Жизнеописание Кирти Ценшаба Ринпоче) / Пер. с тиб. А. Кугявичуса под. ред. А. Терентьева. — СПб.: Нартанг, 2006.</li>
<li>Шантаракшита. Украшение срединности (Мадхьямака-аламкара). С комментарием автора / Пер. с тиб. А. Кугявичуса под общей редакцией А. Терентьева. — М.: Фонд «Сохраним Тибет», 2015. — 144 с.</li>
<li>Шантидева. Собрание практик (Шикшасамуччая) / Пер. с тиб. А. Кугявичуса под общей редакцией А. Терентьева. — М.: Фонд «Сохраним Тибет», 2014. — 536 с.</li>
<li>Терентьев А. А., Кугевичус А. Срединный путь преподавания Дхармы // Дальневосточный буддизм. — СПб., 1992. — С. 33—36.</li>
<li>Чже Цонкапа. Большое руководство к этапам пути Мантры (Нагрим Ченмо). Том 3. - Стр. 320 / А. Кугявичус (пер.), А. Терентьев (ред.). — Санкт-Петербург: Нартанг, 2012.</li>
<li>«Украшение срединности» (Мадхьямака-аламкара) / Пер. с тиб. А. Кугявичуса под общей редакцией А. Терентьева. — М.: Фонд «Сохраним Тибет», 2015. — 144 с.</li>
<li>«Собрание практик» (Шикшасамуччая), / Пер. с тиб. А. Кугявичуса под общей редакцией А. Терентьева. — М.: Фонд «Сохраним Тибет», 2013. — 536 с.</li>
<li>«Последовательное руководство к глубокому пути шести учений Наропы «Обладающее троичной надежностью» / Пер. с тиб. А. Кугявичуса под. ред. А. Терентьева. — СПб.: Нартанг, 2013. — 184 с.</li>
</ul>
`
}];

const script = {
  title: `Add pages`,
  run: (client) => new Promise((resolve, reject) => {

    let count = 0, countError = 0, lastError;
    const _done = (error) => {
      if (error) {
        countError++;
        lastError = error;
      }
      else {
        count++;
      }

      if (count + countError === pages.length) {
        if (countError) {
          lastError.text = countError + ' errors have been occurred. Last error:';
          reject(lastError);
        }
        else {
          resolve({text: count + ' pages have been added'});
        }
      }
    };

    pages.forEach(page => {
      client.index({
        index: config.index,
        type: 'pages',
        id: page.url,
        body: {
          title: page.title,
          text: page.text
        }
      })
        .then(() => _done(), error => _done(error || true))
    });
  })
};

module.exports = script;
