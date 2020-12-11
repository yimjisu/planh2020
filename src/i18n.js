import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  en: {
    translation: {
      "Review": "Review",
      "Rating": "Rating",
      "Write": "Write",
      "Read More": "Read More",
      "No Reviews":"No Reviews",
      "Edit":"Edit",
      "Read More Details":"Read More Details",
      "min":"min",
      "Action":"Action",
      "Time":"Time",
      "Info":"Info",
      "leg":"leg",
      "shoulder":"shoulder",
      "abdominal":"abdominal",
      "chest":"chest",
      "arm":"arm",
      "back":"back",
      "low":"low",
      "middle":"middle",
      "high":"high",
      "My Page": "My Page",
      'Explore routines': 'Explore routines'
    }
  },
  ko: {
    translation: {
      "Review": "리뷰",
      "Rating": "평점",
      "Write": "작성하기",
      "Read More": "더보기",
      "No Reviews":"리뷰 없음",
      "Edit":"수정하기",
      "Read More Details":"디테일 더보기",
      "min":"분",
      "Action":"동작",
      "Time":"시간",
      "Info":"설명",
      "leg":"다리",
      "shoulder":"어깨",
      "abdominal":"복부",
      "chest":"가슴",
      "arm":"팔",
      "back":"등",
      "low":"쉬움",
      "middle":"중간",
      "high":"어려움",
      "My Page": "마이 페이지",
      'Explore routines': '루틴 둘러보기'
    }
  }
};
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
  });
export default i18n;