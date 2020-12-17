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
      'Explore routines': 'Explore routines',
      'Home': 'Home',
      'Check My Level': 'Check My level',
      'Write': 'Write',
      'like': 'like',
      'dislike': 'dislike',
      'Comments': 'Comments',
      'Comment' : 'Comment',
      'Suggestions': 'Suggestions',
      'Suggestion' : 'Suggestion',
      'Write your comment': 'Write your comment',
      'Submit' : 'Submit',
      'submit' : 'submit',
      'Write your suggestion': 'Write your suggestion',
      'Write your own review' : 'Write your own review',
      'Yes' : 'Yes',
      'No' : 'No',
      'Difficulty well set?' : 'Difficulty well set?',
      'Was routine new?' : 'Was routine new?',
      'Was it effective?' : 'Was it effective?',
      'Post well written?' : 'Post well written?',
      'Suggestable?' : 'Suggestable?',
      'Write review before submit' :'Write review before submit', 
      'To report, login first!' :'To report, login first!',
      'To leave a dislike, login first!' :'To leave a dislike, login first!',
      'To leave a like, login first!' :'To leave a like, login first!',
      'Reported. We will check it right away!' :'Reported. We will check it right away!',
      'reply deleted' :'reply deleted' ,
      'Write reply before submit' : 'Write reply before submit', 
      'Reply' : 'Reply' ,
      'Cancel' : 'Cancel',
      'Delete' : 'Delete',
      'Write Reply' :'Write Reply',
      'The review is deleted' :'The review is deleted',
      'There\'s no review yet' :'There\'s no review yet',
      'How about writing yours' : 'How about writing yours',
      'Filter by' :'Filter by' ,
      'Sort by' : 'Sort by',
      'Average Rating' :'Average Rating',
      'Reviews of this routine' : 'Reviews of this routine' ,
      'Only comment' : 'Only comment',
      'Only suggestion' : 'Only suggestion',
      'Show all' : 'Show all',
      'Newest' : 'Newest',
      'Most Upvote' : 'Most Upvote',
      'Highest Rating' : 'Highest Rating',
      'header_tag' : 'Tag',
      'header_time' : 'Time',
      'header_min' : 'min',
      'header_level' : 'Level',
      'header_bodypart' : 'Bodypart',
      'header_title' : 'Title',
      'Type here...' : 'Type here...',
      'Height' : 'Height',
      'Weight' : 'Weight',
      'level_exer' : 'I do exercise...',
      '0~1 days a week' : '0~1 days a week',
      '2~3 days a week' : '2~3 days a week',
      '4 or more days a week' : '4 or more days a week',
      'level_plank' : 'I can do Plank for...',
      'less than 1 min' : 'less than 1 min',
      '1~2 minutes' : '1~2 minutes',
      'more than 2 min' : 'more than 2 min',
      'level_submit' : 'Submit',
      'level_sorry' : 'Sorry, there is no routines appropriate for your level.',
      'Retry' : 'Retry',
      'level_recom' : 'Routine recommendation for your level: ',
      'Routine Search Result' : 'Routine Search Result',
      'Filtering' : '--------- Filtering ---------',
      'Result' : '---------- Result ----------',
      'search_sorry': 'Sorry, there were no matches for your search.',
      'queried_bodypart': 'Bodypart: ',
      'queried_tag': 'Tags: ',
      'queried_level': 'Level: ',
      'queried_time1_1': 'Time:   ',
      'queried_time1_2': ' min to ',
      'queried_time1_3': ' min',
      'queried_time2_1': 'Time:   more than ',
      'queried_time2_2': ' min',
      'queried_time3_1': 'Time:   less than ',
      'queried_time3_2': ' min',
      'queried_title1': 'Including [[',
      'queried_title2': ']] in the title'
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
      "Read More Details":"자세히 보기",
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
      'Explore routines': '루틴 둘러보기',
      'Home': '홈',
      'Check My Level': '레벨 확인하기',
      'Write': '작성하기',
      'like': '좋아요',
      'dislike': '싫어요',
      'Comments': '평가',
      'Comment':'평가',
      'Suggestions': '제안사항',
      'Suggestion': '제안사항',
      'Write your comment': '평가 작성',
      'Submit' : '작성 완료',
      'submit' : '작성 완료',
      'Write your suggestion': '제안사항 작성',
      'Write your own review' : '내 리뷰 작성',
      'Yes' : '예',
      'No' : '아니오',
      'Difficulty well set?' : '난이도가 적절했나요?',
      'Was routine new?' : '루틴이 새로웠나요?',
      'Was it effective?' : '효과가 있었나요?',
      'Post well written?' : '포스팅을 잘 썼나요?',
      'Suggestable?' : '추천할 만한가요?',
      'Write review before submit' : '완료전에 평가나 제안사항을 작성해주세요',
      'To report, login first!' : '신고하려면 로그인하세요',
      'To leave a dislike, login first!' : '싫어요를 남기려면 로그인하세요',
      'To leave a like, login first!' : '좋아요를 남기려면 로그인하세요',
      'Reported. We will check it right away!' : '신고되었습니다. 신속하게 처리하겠습니다',
      'reply deleted' : '답글이 삭제되었습니다',
      'Write reply before submit' : '완료전에 답글을 작성해주세요',
      'Reply' : '답글',
      'Cancel' : '취소',
      'Delete' : '삭제',
      'Write Reply' : '답글 작성하기',
      'The review is deleted' : '리뷰가 삭제되었습니다',
      'There\'s no review yet' : '아직 리뷰가 없습니다',
      'How about writing yours' : '한번 작성해보시는건 어떤가요?',
      'Filter by' : '필터 적용',
      'Sort by' : '정렬 적용',
      'Average Rating' : '평균 평점',
      'Reviews of this routine' : '이 루틴의 리뷰',
      'Only comment' : '평가만',
      'Only suggestion' : '제안사항만',
      'Show all' : '모두',
      'Newest' : '최신 순',
      'Most Upvote' :'좋아요 순',
      'Highest Rating' : '평점 순',
      'header_tag' : '태그',
      'header_time' : '시간',
      'header_min' : '분',
      'header_level' : '난이도',
      'header_bodypart' : '운동 부위',
      'header_title' : '제목',
      'Type here...' : '여기에 입력하세요...',
      'Height' : '신장',
      'Weight' : '체중',
      'level_exer' : '운동을 일주일에 몇 번이나 하시나요?',
      '0~1 days a week' : '0~1일 정도',
      '2~3 days a week' : '2~3일 정도',
      '4 or more days a week' : '4일 이상',
      'level_plank' : '플랭크를 얼마나 오래 할 수 있나요?',
      'less than 1 min' : '1분 이하',
      '1~2 minutes' : '1~2분 정도',
      'more than 2 min' : '2분 이상',
      'level_submit' : '제출',
      'level_sorry' : '죄송하지만 현재 라이브러리에 적당한 난이도의 운동이 없네요..',
      'Retry' : '재시도',
      'level_recom' : '난이도 추천 : ',
      'Routine Search Result' : '루틴 검색 결과',
      'Filtering' : '--------- 검색 조건 ---------',
      'Result' : '---------- 검색 결과 ----------',
      'search_sorry' : '죄송하지만 현재 라이브러리에 조건에 맞는 운동이 없네요..',
      'queried_bodypart': '운동 부위: ',
      'queried_tag': '태그: ',
      'queried_level': '난이도: ',
      'queried_time1_1': '시간:   ',
      'queried_time1_2': ' 분에서 ',
      'queried_time1_3': ' 분까지',
      'queried_time2_1': '시간:   ',
      'queried_time2_2': ' 분 이상',
      'queried_time3_1': '시간:   ',
      'queried_time3_2': ' 분 이하',
      'queried_title1' : '[[',
      'queried_title2': ']]을 포함하는 제목'
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