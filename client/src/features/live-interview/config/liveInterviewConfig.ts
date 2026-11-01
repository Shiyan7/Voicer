import { LivePrepResult } from '../types/LivePrepResult';
import { LiveScenarioStep } from '../types/LiveScenarioStep';

export const PREP_DELAY_MS = 1600;
export const WORD_INTERVAL_MS = 180;
export const ANSWER_CHUNK_INTERVAL_MS = 45;
export const ANSWER_CHUNK_SIZE = 6;
export const PAUSE_BEFORE_ANSWER_MS = 700;
export const PAUSE_BETWEEN_TURNS_MS = 3500;
export const TIMER_INTERVAL_MS = 1000;
export const CODE_KEYWORDS = [
  'const',
  'let',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'new',
  'type',
  'interface',
  'export',
  'import',
  'from',
  'async',
  'await',
  'class',
  'extends',
  'implements',
  'of',
  'in',
  'null',
  'undefined',
  'true',
  'false',
  'number',
  'string',
  'boolean',
  'void',
  'Map',
  'Set',
  'Promise',
];

export const PREP_MOCK: LivePrepResult = {
  sections: [
    {
      titleKey: 'topics',
      items: [
        'Event loop, микро- и макротаски',
        'TypeScript: дженерики, utility types, сужение типов',
        'Реактивность и рендеринг (SolidJS / React)',
        'Архитектура фронтенда: FSD, MVVM',
      ],
    },
    {
      titleKey: 'questions',
      items: [
        'Расскажите о самом сложном проекте',
        'Чем отличается Promise.all от Promise.allSettled?',
        'Как бы вы реализовали debounce?',
        'Как оптимизировать долгий список?',
      ],
    },
    {
      titleKey: 'emphasis',
      items: [
        'Опыт с realtime: WebSocket, GraphQL subscriptions',
        'Перенос проекта на строгий TypeScript',
        'Метрики: ускорение загрузки и снижение багов',
      ],
    },
  ],
};

export const LIVE_SCENARIO: LiveScenarioStep[] = [
  {
    question: 'Расскажите коротко о себе и последнем проекте',
    short:
      'Я фронтенд-разработчик с пятью годами опыта, последний год делал десктоп-приложение для записи и разбора звонков на Tauri и SolidJS.',
    details:
      'Отвечал за клиентскую архитектуру: FSD, MVVM на хуках, GraphQL через urql с подписками.\nНастроил стриминг ответов ИИ и транскрипции в реальном времени.\nСократил время первого рендера списка встреч почти вдвое.',
  },
  {
    question: 'Чем отличается Promise.all от Promise.allSettled?',
    short:
      'Promise.all падает на первой ошибке, а allSettled всегда ждёт все промисы и возвращает статус каждого.',
    details:
      'all подходит, когда результаты зависят друг от друга и частичный успех бесполезен.\nallSettled удобен для независимых запросов, где нужно показать то, что удалось загрузить.\nЕсть ещё any — первый успешный, и race — первый завершившийся.',
  },
  {
    question: 'Напишите функцию debounce на TypeScript',
    short:
      'Храним таймер в замыкании, на каждый вызов сбрасываем его и запускаем заново, функцию вызываем только после паузы.',
    details:
      'Дженерик по аргументам сохраняет типизацию исходной функции.\nМожно добавить cancel и вариант leading для мгновенного первого вызова.',
    code: {
      language: 'typescript',
      text: `export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
    },
  },
  {
    question: 'Как бы вы оптимизировали список из десяти тысяч элементов?',
    short:
      'Виртуализация: рендерим только видимые строки плюс небольшой буфер, остальное заменяем отступами.',
    details:
      'Стабильные ключи и мемоизация строк убирают лишние перерисовки.\nТяжёлую фильтрацию выносим в Web Worker или делаем на сервере с пагинацией.\nДля измерения используем Performance-профайлер и метрику INP.',
  },
  {
    question: 'Почему вы хотите работать именно у нас?',
    short:
      'Мне близок ваш продукт и масштаб задач: realtime и работа с данными — именно то, в чём я сильнее всего.',
    details:
      'Хочу расти в сторону архитектуры и влиять на продукт.\nНравится, что команда открыто пишет о своих инженерных решениях.',
  },
];

export const USE_MOCK_LIVE_SOURCE = import.meta.env.VITE_LIVE_MOCK === 'true';
export const LIVE_AUDIO_PATH = '/live-audio';
export const SHORT_ANSWER_MIN_LENGTH = 80;
