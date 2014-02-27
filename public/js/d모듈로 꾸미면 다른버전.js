﻿define(['LazyRegister', 'model/musicRoomModel', 'D', 'jquery'], function (LazyRegister, musicRoomModel, D) {
    //컨트롤러 선언
    LazyRegister.controller('imgSliderCtrl', ['$scope', '$element',
    function ($scope, $element) {
        var $imgSliderController = $element.find('#img-slider-controller')
          , $slideUpButton = $imgSliderController.find('#up-button')
          , $slideDownButton = $imgSliderController.find('#down-button')
          , $slideExpandButto = $imgSliderController.find('#expand-button');
        var slidingSpeed = 300;

        var d = new D();

        //배열이 아닌 객체로 설정도 가능. 배열은 축소해서 설정하는것.
        d.make({
            moveHeight:         [0,     applyMoveHeight],
            scrollIndex:        [0,     applyScrollIndex],
            ScrollLastIndex:    [0,     applyScrollLastIndex],
            expand:             [false, applyExpand],
            buttonState:        [     , applyButtonState]
        })

        //css
        require(['css!/style/img-slider'], d('moveHeight').apply);

        //객체안에 각각 uid도 있다
        $imgSliderController.on('click', 'button', d(
            function (scrollIndex, expand) {
                if (this === $slideUpButton[0]) {
                    scrollIndex--;
                } else if (this === $slideDownButton[0]) {
                    scrollIndex++;
                } else if (this === $slideExpandButton[0]) {
                    expand = !expand;
                }
            },this) // 즉. 함수를 반환한다. d(~~~~~)는..ㅇㅇ
        );

        /*
        ScrollLastIndex.apply 가 반환하는것은 함수안에서 자신을 실행하는 중첩된 함수를 반환한다.
        
        return function(){
          apply();
        }
        이런걸 반환.

        d(~~~~~~) 도 마찬가지
        */
        $(window).on('resize', d('ScrollLastIndex').apply);

        d('buttonState').apply();

        //클로저가 되므로 $slideUpButton라던가 그런건 다른곳에서 이 함수를 실행해도 정상작동!!!!
        function applyButtonState(expand, scrollIndex, ScrollLastIndex) {
            //$slideUpButton 체크
            (expand || scrollIndex <= 0) ?
              $slideUpButton.attr('disabled', true) : $slideUpButton.removeAttr('disabled');

            //$slideDownButton 체크
            (expand || scrollIndex >= ScrollLastIndex) ?
              $slideDownButton.attr('disabled', true) : $slideDownButton.removeAttr('disabled');

            //$slideExpandButton 체크
            (!expand && ScrollLastIndex === 0) ?
              $slideExpandButton.attr('disabled', true) : $slideExpandButton.removeAttr('disabled');

        }
        function applyScrollIndex(scrollIndex, moveHeight, ScrollLastIndex) {
            scrollIndex =
                (scrollIndex < 0) ? 0 :
                (scrollIndex > ScrollLastIndex) ? ScrollLastIndex :
                scrollIndex;
            slide();

            function slide() {
                $element.stop(true, true).animate({ scrollTop: moveHeight * scrollIndex }, slidingSpeed);
            }
        }
        function applyMoveHeight(moveHeight) {
            moveHeight = $element.height();
        }
        function applyScrollLastIndex(ScrollLastIndex, moveHeight) {
            if (moveHeight === 0) {
                ScrollLastIndex = 0;
            }
            ScrollLastIndex = ($element.prop("scrollHeight") / moveHeight) - 1;
        }
        function applyExpand(expand, scrollIndex) {
            (expand) ? $element.addClass('expand-slider') : $element.removeClass('expand-slider');
            scrollIndex = 0;
        }


        $scope.posts = musicRoomModel.getPosts(0, 12);
    }]);
});
