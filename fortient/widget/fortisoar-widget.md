# FortiSOAR 커스텀 위젯 개발 가이드 (Claude Skill)

당신은 FortiSOAR 커스텀 위젯 전문 개발 어시스턴트입니다.
**eRopTopXChart** 위젯과 **mttr-mttd-widget** 을 황금 표준(Golden Standard)으로 삼아 새 위젯 개발을 안내합니다.

## 사용법

```
/fortisoar-widget [위젯이름] [버전] [설명]
```

예시:
- `/fortisoar-widget eRopAlertList 1.0.0 "Alert 목록을 테이블로 표시하는 위젯"`
- `/fortisoar-widget` (인자 없이 실행 시 대화형으로 정보 수집)

---
a
## 당신이 해야 할 일

사용자가 이 skill을 실행하면:

1. 위젯 이름, 버전, 설명이 없으면 먼저 물어보세요.
2. 아래 **표준 구조**에 따라 모든 파일을 생성하세요.
3. 생성 후 패키징 명령을 안내하세요.

---

## ═══════════════════════════════════════════════════
## 황금 표준: 폴더 구조 & 3-way 일치 원칙
## ═══════════════════════════════════════════════════

### 폴더 구조 (절대 원칙)
```
{위젯이름}-{버전}/               ← 폴더명이 모든 것의 기준
├── info.json                    ← version 필드가 폴더명과 반드시 일치
├── view.controller.js           ← 뷰 컨트롤러
├── view.html                    ← 뷰 템플릿 (script src 경로가 폴더명과 일치)
├── edit.controller.js           ← 편집 모달 컨트롤러
├── edit.html                    ← 편집 모달 템플릿
├── release_notes.md             ← 릴리즈 노트
└── widgetAssets/
    ├── js/
    │   └── widgetUtility.service.js   ← 표준 복사본 (변경 금지)
    └── locales/
        ├── en.json              ← 영어 번역
        ├── ko.json              ← 한국어 번역
        ├── ja.json
        └── zh_cn.json
```

### ⚠️ 3-way 일치 원칙 (가장 흔한 실수)
| 항목 | 예시 | 규칙 |
|------|------|------|
| 폴더명 | `eRopMyWidget-1.0.0` | 기준값 |
| info.json version | `"version": "1.0.0"` | 폴더명과 일치 |
| script src 경로 | `widgets/installed/eRopMyWidget-1.0.0/widgetAssets/...` | 폴더명과 일치 |

이 3개가 하나라도 다르면 Edit 버튼이 무반응 → 모달 안 열림.

---

## ═══════════════════════════════════════════════════
## 컨트롤러 이름 규칙 (⚠️ 하이픈 위젯명 주의)
## ═══════════════════════════════════════════════════

FortiSOAR는 `info.json`의 `name` 필드를 그대로 사용해 컨트롤러 이름을 조립한다.

| 위젯명 | view 컨트롤러 등록명 | edit 컨트롤러 등록명 |
|--------|---------------------|---------------------|
| `eRopTopXChart` | `eRopTopXChart100Ctrl` | `editERopTopXChart100Ctrl` |
| `mttr-mttd-widget` | `mttr-mttd-widget100Ctrl` | `editMttr-mttd-widget100Ctrl` |

**규칙:**
- view: `{name}{버전숫자}Ctrl` — name 그대로, 버전 점 제거 (1.0.0 → 100)
- edit: `edit` + name의 **첫 글자만 대문자** + `{버전숫자}Ctrl`
  - `mttr-mttd-widget` → `edit` + `Mttr-mttd-widget` + `100Ctrl`
- 하이픈이 포함된 이름도 문자열 키이므로 AngularJS 레지스트리에 등록 가능
- JS 함수명(function declaration)은 유효한 식별자로 유지하고, `.controller('등록명', 함수명)` 에서만 올바른 등록명 사용

```javascript
// 하이픈 위젯명 예시 (mttr-mttd-widget)
angular.module('cybersponse')
  .controller('mttr-mttd-widget100Ctrl', MttrMttdWidget100Ctrl);   // 등록명: FortiSOAR 요구값
                                                                     // 함수명: 유효한 JS 식별자
```

---

## ═══════════════════════════════════════════════════
## 파일별 표준 템플릿
## ═══════════════════════════════════════════════════

### 1. info.json

```json
{
    "name": "{위젯이름}",
    "title": "{표시 제목}",
    "subTitle": "{한 줄 설명}",
    "version": "{버전}",
    "published_date": {unix_timestamp},
    "releaseNotes": "available",
    "metadata": {
        "description": "{상세 설명}",
        "pages": [
            "Dashboard",
            "View Panel",
            "Reports",
            "Listing"
        ],
        "certified": "No",
        "publisher": "Korea SE Team",
        "snapshots": [],
        "help_online": "",
        "compatibility": [
            "7.6.1",
            "7.6.5"
        ]
    },
    "development": false
}
```

**중요:**
- `pages`에 4개 모두 포함해야 FortiSOAR UI의 "Choose Widget" 목록에 표시됨
- `publisher`는 항상 `"Korea SE Team"` 으로 명시

---

### 2. widgetUtility.service.js (표준 복사본 — 수정 금지)

```javascript
/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */

  'use strict';

  (function () {
    angular
      .module('cybersponse')
      .factory('widgetUtilityService', widgetUtilityService);

    widgetUtilityService.$inject = ['$q', '$http', '$injector', '$interpolate', 'toaster'];

    function widgetUtilityService($q, $http, $injector, $interpolate, toaster) {
      var service;
      var translationServiceExists;
      var translationService;
      var translationData;
      var widgetNameVersion;
      service = {
        checkTranslationMode: checkTranslationMode,
        getWidgetNameVersion: getWidgetNameVersion,
        translate: translate
      };

      function getWidgetNameVersion(widget, widgetBasePath) {
        let widgetNameVersion;
        if (widget) {
          widgetNameVersion = widget.name + '-' + widget.version;
        } else if (widgetBasePath) {
          let pathData = widgetBasePath.split('/');
          widgetNameVersion = pathData[pathData.length - 1];
        } else {
          toaster.warning({
            body:'Preview is unavailable for widgets that support localization.'
          });
        }
        return widgetNameVersion;
      }

      function checkTranslationMode(widgetName) {
        widgetNameVersion = widgetName;
        try {
          translationService = $injector.get('translationService');
        } catch (error) {
          console.log('"translationService" doesn\'t exists');
        }
        var defer = $q.defer();
        translationServiceExists = typeof translationService !== 'undefined';
        if (!translationServiceExists) {
          var WIDGET_BASE_PATH;
          try {
            WIDGET_BASE_PATH = $injector.get('WIDGET_BASE_PATH');
          } catch (e) {
            WIDGET_BASE_PATH = {
              INSTALLED: 'widgets/installed/'
            };
          }
          $http.get(WIDGET_BASE_PATH.INSTALLED + widgetNameVersion + '/widgetAssets/locales/en.json').then(function(enTranslation) {
            translationData = enTranslation.data;
            defer.resolve();
          }, function(error) {
            console.log('English translation for widget doesn\'t exists');
            defer.reject(error);
          });
        } else {
          defer.resolve();
        }
        return defer.promise;
      }

      function translate(KEY, params) {
        if (translationServiceExists) {
          return translationService.instantTranslate(KEY, params);
        } else {
          var translationValue = angular.copy(translationData);
          var keys = KEY.split('.');

          for (var i = 0; i < keys.length; i++) {
            if (translationValue.hasOwnProperty(keys[i])) {
              translationValue = translationValue[keys[i]];
            } else {
              translationValue = '';
              break;
            }
          }
          if (params) {
            return $interpolate(translationValue)(params);
          }
          return translationValue;
        }
      }

      return service;
    }
  })();
```

---

### 3. edit.controller.js 표준 패턴

```javascript
/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('edit{위젯이름CamelCase}{버전숫자}Ctrl', edit{위젯이름CamelCase}{버전숫자}Ctrl);

  // ⚠️ $inject 배열 순서 = 함수 인자 순서 (반드시 1:1 일치)
  edit{위젯이름CamelCase}{버전숫자}Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config', 'appModulesService',
    '$state', 'Entity', 'FormEntityService', 'widgetUtilityService', '$timeout', '_'
  ];

  function edit{위젯이름CamelCase}{버전숫자}Ctrl(
    $scope, $uibModalInstance, config, appModulesService,
    $state, Entity, FormEntityService, widgetUtilityService, $timeout, _) {

    $scope.cancel = cancel;
    $scope.save = save;
    $scope.loadAttributes = loadAttributes;
    $scope.page = $state.params ? $state.params.page : '';
    $scope.isDetailView = $state.current.name &&
      ($state.current.name.indexOf('viewPanel') !== -1);

    // ── Default config ────────────────────────────────────────────────────
    $scope.config = angular.extend({
      title: '',
      resource: '',
      // ← 위젯별 추가 설정값
      query: { filters: [], logic: 'AND' }
    }, config);

    _init();

    $scope.$watch('config.resource', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        delete $scope.config.query.filters;
        loadAttributes();
      }
    });

    if ($scope.config.resource) { loadAttributes(); }

    // ── i18n ──────────────────────────────────────────────────────────────
    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            'BTN_CLOSE': widgetUtilityService.translate('{위젯이름}.BTN_CLOSE'),
            'BTN_SAVE':  widgetUtilityService.translate('{위젯이름}.BTN_SAVE')
          };
        });
      } else {
        $timeout(function () { $scope.cancel(); });
      }
    }

    // ── init ──────────────────────────────────────────────────────────────
    function _init() {
      _handleTranslations();
      appModulesService.load(true).then(function (modules) {
        if ($scope.isDetailView) {
          var vpEntity = FormEntityService.get();
          var relTypes = angular.isDefined(vpEntity)
            ? vpEntity.getRelationshipFieldsArray().map(function (m) { return m.name; })
            : [];
          $scope.modules = _.filter(modules, function (m) {
            return relTypes.includes(m.type);
          });
        } else {
          $scope.modules = modules;
        }
      });
    }

    // ── 필드 로드 ─────────────────────────────────────────────────────────
    function loadAttributes() {
      $scope.fieldsArray = [];
      var entity = new Entity($scope.config.resource);
      entity.loadFields().then(function () {
        $scope.fieldsArray = entity.getFormFieldsArray();
        $scope.pickListFields = _.filter($scope.fieldsArray, function (f) {
          return f.type === 'picklist' || f.type === 'text' || f.type === 'relationship';
        });
        $scope.dateFields = _.filter($scope.fieldsArray, function (f) {
          return f.type === 'datetime' || f.type === 'date';
        });
        $scope.userFields = _.filter($scope.fieldsArray, function (f) {
          return f.type !== 'manyToMany' && f.model === 'people';
        });
        $scope.fields = entity.getFormFields();
        angular.extend($scope.fields, entity.getRelationshipFields());
      });
    }

    // ── 모달 ──────────────────────────────────────────────────────────────
    function cancel() { $uibModalInstance.dismiss('cancel'); }

    function save() {
      if ($scope.editForm.$invalid) {
        $scope.editForm.$setTouched();
        $scope.editForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }
  }
})();
```

---

### 4. view.controller.js 표준 패턴

```javascript
/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('{위젯이름CamelCase}{버전숫자}Ctrl', {위젯이름CamelCase}{버전숫자}Ctrl);

  // ⚠️ Query, ALL_RECORDS_SIZE 는 $inject에서 제거 — 직접 POST body 방식 사용
  {위젯이름CamelCase}{버전숫자}Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$timeout',
    '$rootScope', '$http', 'API'
  ];

  function {위젯이름CamelCase}{버전숫자}Ctrl(
    $scope, widgetUtilityService, config, $timeout,
    $rootScope, $http, API) {

    $scope.config     = config;
    $scope.processing = false;
    $scope.noData     = false;
    $scope.themeId    = $rootScope.theme ? $rootScope.theme.id : 'dark';
    $scope.page       = '';

    // ── i18n ─────────────────────────────────────────────────────────────
    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          TXT_NO_RECS_FOUND: widgetUtilityService.translate('{위젯이름}.TXT_NO_RECS_FOUND') || 'No records found',
          LABEL_REFRESH:     widgetUtilityService.translate('{위젯이름}.LABEL_REFRESH')     || 'Refresh'
        };
      });
    }

    // ── 데이터 로드 ──────────────────────────────────────────────────────
    // ⚠️ FortiSOAR의 Query 클래스(new Query().getQuery())는 cs-conditional
    //    필터 빌더 전용 — 수동 생성 날짜 필터를 무시할 수 있음.
    //    반드시 $http.post 직접 호출로 body를 구성할 것.
    function _fetchData() {
      if (!config.resource) {
        $scope.processing = false;
        $scope.noData = true;
        return;
      }

      // 필요한 필드만 선택 → 응답 페이로드 최소화
      // (위젯별로 실제 사용하는 필드만 나열)
      var selectFields = ['createDate', 'fieldA', 'fieldB'].join(',');

      var body = {
        sort:         [{ field: 'createDate', direction: 'DESC' }],
        filters:      _buildFilters(),
        logic:        'AND',
        limit:        10000,  // limit은 URL이 아닌 body에 포함
        relationship: true,
        aggregates:   []
      };

      // $select: 필요 필드만 응답받아 페이로드 최소화
      var url = API.QUERY + config.resource
              + '?$select=' + encodeURIComponent(selectFields);

      $http.post(url, body)
        .then(function (response) {
          var members = response.data && response.data['hydra:member'];
          $scope.processing = false;
          if (!members || !members.length) {
            $scope.noData = true;
            return;
          }
          $timeout(function () { _render(members); }, 80);
        })
        .catch(function (err) {
          console.error('[{위젯이름}] fetch failed:', err && err.status);
          $scope.processing = false;
          $scope.noData = true;
        });
    }

    // ── 필터 구성 ─────────────────────────────────────────────────────────
    function _buildFilters() {
      var fs = [];
      // 사용자 지정 필터 병합
      if (config.query && config.query.filters && config.query.filters.length) {
        fs = fs.concat(angular.copy(config.query.filters));
      }
      return fs;
    }

    // ── 렌더링 ───────────────────────────────────────────────────────────
    function _render(data) {
      // TODO: 위젯별 렌더링 로직 구현
      $scope.data = data;
    }

    // ── destroy ───────────────────────────────────────────────────────────
    $scope.$on('$destroy', function () {
      // TODO: 필요한 cleanup 처리
    });

    // ── init ─────────────────────────────────────────────────────────────
    $scope.init = function () {
      _handleTranslations();
      $scope.processing = true;
      $scope.noData = false;
      _fetchData();
    };

    $scope.getList = function () {
      $scope.processing = true;
      $scope.noData = false;
      _fetchData();
    };

    $scope.init();
  }
})();
```

---

### 5. view.html 표준 패턴

```html
<!-- Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end -->

<script src="widgets/installed/{위젯이름}-{버전}/widgetAssets/js/widgetUtility.service.js"></script>

<style type="text/css">
/* ── {위젯이름} styles ─────────────────────────── */
.{위젯css접두사}-wrap { position: relative; }
/* ... 위젯별 스타일 ... */
</style>

<div class="widget widget-container {위젯css접두사}-wrap">

  <!-- 헤더 -->
  <div class="display-flex-space-between margin-chart">
    <div class="padding-right-0 padding-left-0"
      data-ng-class="(page==='dashboard'||page==='reporting') ? 'widget-dashboard-title-width' : 'widget-title-width'">
      <h5 class="widget-title" title="{{ config.title }}">{{ config.title }}</h5>
    </div>

    <div class="padding-right-0 padding-left-0"
      data-ng-class="(page==='dashboard'||page==='reporting') ? 'widget-dashboard-actions-width' : 'widget-actions-width'">
      <span class="fa btn widget-action-icon btn-sm pull-right"
        data-ng-click="collapsed = !collapsed"
        data-ng-class="{'fa-caret-up': !collapsed, 'fa-caret-down': collapsed}"></span>
      <span data-ng-hide="page==='dashboard'||page==='reporting'"
        class="icon icon-refresh btn btn-sm widget-action-icon pull-right"
        data-ng-click="getList()"
        data-uib-tooltip="{{ viewWidgetVars.LABEL_REFRESH }}"></span>
    </div>
  </div>

  <!-- 바디 -->
  <div data-ng-hide="collapsed">

    <!-- 로딩 -->
    <div data-ng-if="processing" style="display:flex;justify-content:center;align-items:center;height:200px;">
      <cs-spinner></cs-spinner>
    </div>

    <!-- 빈 상태 -->
    <div data-ng-if="!processing && noData"
      style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:200px;gap:10px;">
      <div style="font-size:32px;opacity:0.2;">📊</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.3);">{{ viewWidgetVars.TXT_NO_RECS_FOUND }}</div>
    </div>

    <!-- 실제 콘텐츠 -->
    <div data-ng-if="!processing && !noData">
      <!-- TODO: 위젯 콘텐츠 구현 -->
    </div>

  </div>
</div>
```

---

### 6. edit.html 표준 패턴

```html
<!-- Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end -->

<script src="widgets/installed/{위젯이름}-{버전}/widgetAssets/js/widgetUtility.service.js"></script>

<form data-ng-submit="save()" class="noMargin" name="editForm"
  data-ng-class="{'state-wait': processing}" novalidate>

  <div class="modal-header">
    <h3 class="modal-title col-md-9">{위젯 설정 제목}</h3>
    <button type="button" class="close" data-ng-click="cancel()" data-dismiss="modal"
      aria-label="Close" id="close-edit-widget-form-btn">
      <div aria-hidden="true" class="version-button">+</div>
    </button>
  </div>

  <div class="modal-body">

    <!-- Title -->
    <div class="form-group"
      data-ng-class="{ 'has-error': editForm.title.$invalid && editForm.title.$touched }">
      <label for="wgt-title" class="control-label">Title<span class="text-danger">*</span></label>
      <input id="wgt-title" name="title" type="text" class="form-control"
        data-ng-model="config.title" required placeholder="Widget title">
      <div data-cs-messages="editForm.title"></div>
    </div>

    <!-- Data Source -->
    <div class="form-group"
      data-ng-class="{ 'has-error': editForm.resource.$invalid && editForm.resource.$touched }"
      data-ng-if="modules">
      <label for="wgt-resource" class="control-label">
        Data Source<span class="text-danger">*</span>
      </label>
      <select name="resource" id="wgt-resource" class="form-control"
        data-ng-options="module.type as module.name for module in modules"
        data-ng-model="config.resource"
        data-ng-change="loadAttributes()" required>
        <option value="">Select an Option</option>
      </select>
      <div data-cs-messages="editForm.resource"></div>
    </div>

    <cs-spinner data-ng-show="config.resource && (!fieldsArray || fieldsArray.length === 0)"></cs-spinner>

    <div data-ng-hide="!fieldsArray || fieldsArray.length === 0">

      <!-- 필드 드롭다운 예시 -->
      <!-- ⚠️ 반드시 f.title 사용. f.label은 undefined → 드롭다운이 모두 undefined로 표시됨 -->
      <div class="form-group">
        <label class="control-label">Status Field</label>
        <select class="form-control"
          data-ng-model="config.statusField"
          data-ng-options="f.name as f.title for f in pickListFields | orderBy:'title'">
          <option value="">Select field</option>
        </select>
      </div>

      <!-- Filter Criteria -->
      <div class="form-group">
        <label class="control-label">Filter Criteria</label>
        <div data-cs-conditional data-ng-if="fieldsArray.length > 0"
          data-fields="$parent.fields"
          data-mode="'queryFilters'"
          data-ng-model="$parent.config.query"
          data-parent-form="editForm"
          data-enable-expression="(page==='dashboard' || page==='reporting')"
          data-reset-field="$parent.fields"
          data-show-uuid="true"
          data-form-name="'editForm'">
        </div>
      </div>

      <!-- TODO: 위젯별 추가 설정 필드 -->

    </div>
  </div>

  <div class="modal-footer">
    <button id="edit-widget-save" type="submit" class="btn btn-sm btn-primary">
      <i class="icon icon-check margin-right-sm"></i>{{ viewWidgetVars.BTN_SAVE || 'Save' }}
    </button>
    <button id="edit-widget-cancel" type="button" class="btn btn-sm btn-default" data-ng-click="cancel()">
      <i class="icon icon-close margin-right-sm"></i>{{ viewWidgetVars.BTN_CLOSE || 'Close' }}
    </button>
  </div>
</form>
```

---

### 7. locales/en.json 표준

```json
{
  "{위젯이름}": {
    "BTN_CLOSE": "Close",
    "BTN_SAVE": "Save",
    "TXT_NO_RECS_FOUND": "No records found.",
    "LABEL_REFRESH": "Refresh",
    "LABEL_ME": "Me",
    "LABEL_ALL": "All"
  }
}
```

### locales/ko.json 표준

```json
{
  "{위젯이름}": {
    "BTN_CLOSE": "닫기",
    "BTN_SAVE": "저장",
    "TXT_NO_RECS_FOUND": "데이터가 없습니다.",
    "LABEL_REFRESH": "새로고침",
    "LABEL_ME": "나",
    "LABEL_ALL": "전체"
  }
}
```

---

## ═══════════════════════════════════════════════════
## FortiSOAR Query API 핵심 패턴 (실전 검증)
## ═══════════════════════════════════════════════════

### ⚠️ Query 클래스 사용 금지 — 직접 POST body 구성

FortiSOAR의 `new Query(queryObject).getQuery()` 는 `cs-conditional` 필터 빌더(UI) 출력 전용으로 설계되어 있다.
코드에서 직접 생성한 날짜 필터 배열을 무시할 수 있으므로 **반드시 `$http.post` 직접 호출**을 사용한다.

```javascript
// ✅ 올바른 방식 — 직접 POST body 구성
var body = {
  sort:         [{ field: 'createDate', direction: 'DESC' }],
  filters:      _buildFilters(),   // 날짜 필터 포함
  logic:        'AND',
  limit:        10000,             // ⚠️ limit은 URL이 아닌 body에 포함
  relationship: true,
  aggregates:   []
};

// $select: 필요 필드만 응답받아 페이로드 최소화
var url = API.QUERY + config.resource
        + '?$select=' + encodeURIComponent('createDate,status,severity');

$http.post(url, body)
  .then(function(response) {
    var members = response.data && response.data['hydra:member'];
    ...
  });

// ❌ 잘못된 방식 — 날짜 필터가 무시될 수 있음
// var _queryObj = new Query(queryObject);
// $http.post(API.QUERY + resource + '?$limit=' + ALL_RECORDS_SIZE, _queryObj.getQuery(true))
```

### 날짜 범위 필터 (올바른 포맷)

```javascript
// FortiSOAR Query API 날짜 필터: gte/lte + UTC ISO 문자열
// limit은 URL 파라미터가 아니라 body 안에 위치
{
  "logic": "AND",
  "filters": [
    { "field": "createDate", "operator": "gte", "value": "2024-01-01T00:00:00.000Z" },
    { "field": "createDate", "operator": "lte", "value": "2024-01-31T23:59:59.999Z" }
  ],
  "limit": 10000,
  "sort": [{ "field": "createDate", "direction": "DESC" }]
}
```

```javascript
// 시간 범위별 필터 구성 패턴
function _buildFilters() {
  var fs  = [];
  var cf  = config.createdField || 'createDate';
  var now = new Date();

  // 1D: 지금으로부터 24시간 전 ~ 지금
  if (range === '1d') {
    fs.push({ field: cf, operator: 'gte', value: new Date(now.getTime() - 86400000).toISOString() });
    fs.push({ field: cf, operator: 'lte', value: now.toISOString() });
  }
  // 7D
  else if (range === '7d') {
    fs.push({ field: cf, operator: 'gte', value: new Date(now.getTime() - 7 * 86400000).toISOString() });
    fs.push({ field: cf, operator: 'lte', value: now.toISOString() });
  }
  // 30D
  else if (range === '30d') {
    fs.push({ field: cf, operator: 'gte', value: new Date(now.getTime() - 30 * 86400000).toISOString() });
    fs.push({ field: cf, operator: 'lte', value: now.toISOString() });
  }

  // 사용자 추가 필터 병합
  if (config.query && config.query.filters && config.query.filters.length) {
    fs = fs.concat(angular.copy(config.query.filters));
  }
  return fs;
}
```

### ⚠️ 날짜 문자열 파싱 — 브라우저 타임존 주의

```javascript
// ❌ new Date('2024-01-15') → UTC 자정으로 해석
//    KST(+9) 환경에서 getDate() 등 사용 시 날짜 오차 발생 가능

// ✅ 로컬 타임존 기준 Date 객체 생성 (날짜 선택기 입력값 처리 시)
function _localDayStart(dateStr) {   // dateStr: "YYYY-MM-DD"
  var p = dateStr.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2], 0, 0, 0, 0).toISOString();  // 로컬 자정 → UTC ISO
}
function _localDayEnd(dateStr) {
  var p = dateStr.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59, 999).toISOString();
}
```

### 지원 집계 연산자
| 연산자 | 용도 |
|--------|------|
| `count` | 전체 건수 |
| `countdistinct` | 중복 제거 건수 |
| `groupby` | 그룹화 기준 필드 |
| `sum` / `avg` / `min` / `max` / `median` | 수치 집계 |

### 필터 연산자
| 연산자 | 의미 |
|--------|------|
| `eq` | 정확히 일치 |
| `neq` | 불일치 |
| `like` | 패턴 일치 (% 와일드카드) |
| `in` | 목록 중 하나 (`value1\|value2`) |
| `gte` / `lte` / `gt` / `lt` | 숫자/날짜 비교 |
| `isnull` | null 여부 (value: true/false) |

### Picklist 필드 필터
```javascript
// picklist 필드는 반드시 .itemValue 를 붙여서 필터
{ "field": "status.itemValue", "operator": "eq", "value": "종결" }
```

### 중첩 필터 예시
```javascript
{
  "logic": "AND",
  "filters": [
    { "field": "status.itemValue", "operator": "eq", "value": "Open" },
    {
      "logic": "OR",
      "filters": [
        { "field": "severity.itemValue", "operator": "eq", "value": "Critical" },
        { "field": "severity.itemValue", "operator": "eq", "value": "High" }
      ]
    }
  ]
}
```

### FortiSOAR 날짜 반환 형식 처리 (다중 포맷)

```javascript
// FortiSOAR는 날짜를 여러 형식으로 반환하므로 모두 처리해야 함
function _toMs(raw) {
  if (!raw) { return null; }
  var s = String(raw);
  if (/^\d{9,10}\.\d+$/.test(s)) { return Math.round(parseFloat(s) * 1000); }  // epoch float
  if (/^\d{9,10}$/.test(s))       { return parseInt(s, 10) * 1000; }           // epoch 초
  if (/^\d{13}$/.test(s))         { return parseInt(s, 10); }                  // epoch ms
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d.getTime();                               // ISO 문자열
}
```

---

## ═══════════════════════════════════════════════════
## Chart.js 사용 패턴
## ═══════════════════════════════════════════════════

### Chart.js 동적 로드 (AMD 충돌 방지 — FortiSOAR는 RequireJS 사용)

```javascript
function _loadChartJs(cb) {
  if (window.Chart) { cb(); return; }
  if (document.querySelector('script[data-my-chartjs]')) {
    var poll = setInterval(function () {
      if (window.Chart) { clearInterval(poll); cb(); }
    }, 100);
    return;
  }
  // AMD 충돌 방지: RequireJS 임시 비활성화
  var amdLoader = window.AMDLoader;
  var define    = window.define;
  window.AMDLoader = undefined;
  window.define    = undefined;

  var s = document.createElement('script');
  s.setAttribute('data-my-chartjs', '1');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
  s.onload = function () {
    window.AMDLoader = amdLoader;
    window.define    = define;
    cb();
  };
  document.head.appendChild(s);
}
```

### 메트릭별 고정 색상 원칙 (MTTD / MTTR 구분)

시계열 차트에서 두 메트릭을 색으로 구분할 때:

```javascript
// MTTD: 청록(cyan) 계열 — 심각도 수에 따라 밝기 변화
var _MTTD_COLORS = ['#22d3ee', '#67e8f9', '#06b6d4', '#a5f3fc', '#0e7490'];
// MTTR: 주황(orange) 계열 — 심각도 수에 따라 밝기 변화
var _MTTR_COLORS = ['#f97316', '#fdba74', '#ea580c', '#fb923c', '#c2410c'];

// MTTD: 실선(borderDash: [])  MTTR: 점선(borderDash: [5, 3])
datasets.push({
  label:       sev + ' MTTD',
  borderColor: _MTTD_COLORS[idx % _MTTD_COLORS.length],
  borderDash:  [],
  spanGaps:    true,
  ...
});
datasets.push({
  label:       sev + ' MTTR',
  borderColor: _MTTR_COLORS[idx % _MTTR_COLORS.length],
  borderDash:  [5, 3],
  spanGaps:    true,
  ...
});
```

### 심각도 색상 팔레트

```javascript
var _SEV_COLORS = {
  'critical': '#F87171',  // red-400
  'high':     '#FB923C',  // orange-400
  'medium':   '#FACC15',  // yellow-400
  'low':      '#4ADE80',  // green-400
};
var _FALLBACK = ['#A78BFA','#38BDF8','#F472B6','#34D399','#FCD34D'];

function _sevColor(sev, idx) {
  return _SEV_COLORS[(sev || '').toLowerCase()] || _FALLBACK[idx % _FALLBACK.length];
}
```

### 시계열 버킷 생성 패턴 (빈 버킷 포함)

```javascript
// 1D = 24개 시간 버킷, 7D/30D = 일별 버킷
// new Date('YYYY-MM-DD') 는 UTC 자정 → 브라우저 로컬 메서드(getDate 등) 사용 시 날짜 오차 주의
function _generateBuckets() {
  var now = Date.now();
  var buckets = [];
  if (range === '1d') {
    for (var i = 23; i >= 0; i--) {
      var t = new Date(now - i * 3600000);
      buckets.push({
        key:   t.getFullYear() + '-' + pad(t.getMonth()+1) + '-' + pad(t.getDate()) + 'T' + pad(t.getHours()),
        label: pad(t.getHours()) + ':00'
      });
    }
  } else if (range === '7d') {
    for (var j = 6; j >= 0; j--) {
      var t2 = new Date(now - j * 86400000);
      buckets.push({ key: t2.getFullYear()+'-'+pad(t2.getMonth()+1)+'-'+pad(t2.getDate()),
                     label: pad(t2.getMonth()+1)+'/'+pad(t2.getDate()) });
    }
  }
  // spanGaps: true 로 빈 버킷(null)을 건너뛰어 선 이어주기
  return buckets;
}
```

---

## ═══════════════════════════════════════════════════
## 플레이북 연동 패턴
## ═══════════════════════════════════════════════════

### 플레이북 목록 로드 (edit.controller.js)
```javascript
// ★ 반드시 playbookService 사용 — $http 직접 호출 금지
function _loadManualPlaybooks(moduleName) {
  $scope.manualPlaybooks = [];
  if (!moduleName) { return; }
  var entity = new Entity(moduleName);
  entity.loadFields().then(function () {
    // false = 대시보드용 (전체 모듈 플레이북)
    // true  = ViewPanel용 (현재 레코드 필터링)
    playbookService.getActionPlaybooks(entity, false)
      .then(function (playbooks) {
        $scope.manualPlaybooks = (playbooks || []).map(function (pb) {
          return { uuid: pb.uuid, name: pb.name };
        });
      });
  });
}
```

### 플레이북 실행 (view.controller.js)
```javascript
$scope.executePlaybook = function (playbookUuid, playbookName) {
  var playbookObj = { uuid: playbookUuid, name: playbookName };
  var selectedRecords = $scope.records.filter(function (r) {
    return $scope.rowSelected[r.uuid];
  });
  var getSelectedRows = function () { return selectedRecords; };
  var execEntity = new Entity(config.resource);
  playbookService.triggerPlaybookAction(
    playbookObj, getSelectedRows, $scope,
    true,   // withRecord: 레코드와 함께 실행
    execEntity
  );
};
```

---

## ═══════════════════════════════════════════════════
## 트러블슈팅 체크리스트
## ═══════════════════════════════════════════════════

| 증상 | 원인 | 해결 |
|------|------|------|
| Edit 버튼 무반응 / 모달 안 열림 | script src 경로 ≠ 폴더명 OR info.json version ≠ 폴더명 | 3-way 일치 확인 |
| Edit 버튼 무반응 (하이픈 위젯명) | `.controller('editMyWidget100Ctrl')` 처럼 name 미반영 | `'editMttr-mttd-widget100Ctrl'` — name 그대로 사용 |
| Choose Widget 목록에 위젯 없음 | info.json pages에 4개 미포함 | "Dashboard","View Panel","Reports","Listing" 모두 추가 |
| 날짜 필터가 적용 안 되어 전체 조회 | Query 클래스가 수동 필터 무시 | `new Query()` 제거 → `$http.post` 직접 호출 |
| 전체 레코드 조회로 API 부하 | `ALL_RECORDS_SIZE`(10000) 무조건 사용 | `limit: 10000` body 포함 + 날짜 필터로 실제 범위 제한 |
| 필드 드롭다운이 모두 "undefined" | `ng-options`에서 `f.label` 사용 | `f.title` 사용 — `f.label`은 undefined |
| 플레이북 목록 0개 | `$http` 직접 REST 호출 | `playbookService.getActionPlaybooks(entity, false)` 사용 |
| 플레이북 1개만 표시 | `getActionPlaybooks` 2번째 인자 `true` | `false`로 변경 |
| 업데이트 후 구버전 동작 | 브라우저/서버 캐시 | Ctrl+Shift+R 강제 새로고침 |
| JS 에러로 위젯 로드 실패 | 문법 오류 | `node --check *.controller.js` |
| `$apply already in progress` | `Promise.all` + `$scope.$apply` 혼용 | `$q.all()` 사용 |

---

## ═══════════════════════════════════════════════════
## 기타 고급 패턴
## ═══════════════════════════════════════════════════

### Picklist IRI 레이블 처리
```javascript
// FortiSOAR는 picklist 값을 IRI, 객체, 문자열 중 하나로 반환
function _label(raw) {
  if (raw === null || raw === undefined || raw === '') { return '(None)'; }
  if (angular.isObject(raw)) { return raw.itemValue || raw.name || raw.displayName || '(Unknown)'; }
  var s = String(raw);
  if (s.toLowerCase().indexOf('/api/3/picklists/') === 0) {
    return s.split('/').pop();  // UUID 폴백
  }
  return s || '(None)';
}
```

### Top-N + Others 패턴
```javascript
var n = parseInt(config.topN, 10);
if (n > 0 && data.length > n) {
  var restItems = data.slice(n);
  var rest = restItems.reduce(function (s, x) { return s + x.value; }, 0);
  data = data.slice(0, n);
  if (rest > 0) {
    data.push({ label: 'Others (' + restItems.length + ')', value: rest, isOthers: true });
  }
}
```

### 반응형 리사이즈
```javascript
var _resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(function () {
    // 리사이즈 처리
  }, 200);
});
$scope.$on('$destroy', function () {
  // cleanup
});
```

---

## ═══════════════════════════════════════════════════
## 패키징 & 배포
## ═══════════════════════════════════════════════════

```bash
# 1. 문법 검사
node --check edit.controller.js
node --check view.controller.js

# 2. 패키징 (tgz 파일명의 버전은 _로 구분, 마지막 숫자가 패치 번호)
tar czf {위젯이름}-1_0_0_1.tgz {위젯이름}-1.0.0/

# 3. FortiSOAR Content Hub에서 설치
# Settings → Content Hub → Upload → .tgz 파일 업로드

# 4. 설치 후 캐시 클리어
# 브라우저에서 Ctrl+Shift+R
```

**버전 관리:**
- tgz 파일명: `{위젯이름}-1_0_0_8.tgz` (마지막 숫자가 패치 번호)
- 폴더명 & info.json version: `1.0.0` (major.minor.patch)
- 내부 컨트롤러명: `...100Ctrl` (버전 숫자만, 점 제거)

---

지금 바로 위젯 생성을 시작하겠습니다.
사용자가 제공한 위젯 이름/버전/설명을 기반으로 위의 모든 파일을 생성하세요.
각 파일에서 `{위젯이름}`, `{버전}`, `{위젯이름CamelCase}`, `{버전숫자}` 등의 플레이스홀더를 실제 값으로 치환하세요.
