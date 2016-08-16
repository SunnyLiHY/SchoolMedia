// 时间区间和时间单选控件
'use strict';
angular.module('core',[])
    .directive("datetime",  function() {
        return {
            restrict: "AE",
            templateUrl: "dateOption/datetime.template.html",
            // template:"<div>dddd</div>",
            replace: true,
            //@单向文本绑定，=双向绑定，&在父scope中执行函数
            scope: {},
            link: function($scope, elem, attrs) {
                var configLeft = {
                    inline: true,
                    enableTime: true,
                    time_24hr: true,
                    enableSeconds: true
                };
                var configRight = {
                    inline: true,
                    enableTime: true,
                    time_24hr: true,
                    enableSeconds: true
                };


                var btnSuccess = elem.find('.btn-success');
                var btnDefault = elem.find('.btn-default');
                /**
                 *获取startDate，endDate
                 */
                var date = {};
                var onChangeLeft = function(dateObj, dateStr, instance) {
                    date.startDate = moment(dateObj).format('YYYY-MM-DD HH:mm:ss');

                    //left开始日期选定时，改变right日历标签中结束日期的可选值
                    // 当天也可选，此时要判断时分秒的大小。决定确定按钮btnSuccess的可用性,调用方法isValidDateRange
                    configRight.disable = [
                        function(allDate) {
                            if (date.startDate) {
                                return allDate - moment(date.startDate.substring(0, 10)) < 0;
                            }
                        }
                    ];
                    new flatpickr(calenders[1], configRight);
                    isValidDateRange(date.startDate, date.endDate);
                };
                var onChangeRight = function(dateObj, dateStr, instance) {
                    date.endDate = moment(dateObj).format('YYYY-MM-DD HH:mm:ss');
                    isValidDateRange(date.startDate, date.endDate);
                };

                // 结束时间是否大于开始时间,改变确定按钮的可使用性disabled
                var isValidDateRange = function(startDate, endDate) {
                    if (!endDate) {
                        btnSuccess.attr('disabled', true);
                    } else if (moment(date.startDate) - moment(date.endDate) >= 0) {
                        btnSuccess.attr('disabled', true);
                    } else
                        btnSuccess.attr('disabled', false);
                }

                var calenders = elem.find('.tsa-calender');
                configLeft.onChange = onChangeLeft;
                var left = new flatpickr(calenders[0], configLeft);
                configRight.onChange = onChangeRight;
                var right = new flatpickr(calenders[1], configRight);

                var datetimeInput = elem.find('.tsa-datetime-input');
                var dropdown = elem.find('.tsa-dropdown');


                /**
                 * 隐藏时间选择面板
                 */
                var hideDropdown = function() {
                    dropdown.removeClass('tsa-dropdown-show');
                };

                /**
                 * 显示时间选择面板
                 */
                var showDropdown = function() {
                    dropdown.addClass('tsa-dropdown-show');
                };

                datetimeInput.on('click', function(event) {
                    event.preventDefault();
                    showDropdown();
                });

                btnDefault.on('click', function(event) {
                    event.preventDefault();
                    hideDropdown();
                });

                btnSuccess.on('click', function(event) {
                    event.preventDefault();
                    hideDropdown();
                    elem.find('.tsa-datetime-input')[0].value = date.startDate + ' 至 ' + date.endDate;

                });

                //绑定和解绑点击事件：当点击事件不在elem上或者其子元素上时，隐藏面板
                var $html = $('html'),
                    eventName = "click.tsaDatetimeRange" + (Math.random() * 1000).toFixed(); // 生成一个随机的事件命名空间
                $html.on(eventName, function(event) {
                    if (!$(event.target).isChildAndSelfOf(elem)) {
                        hideDropdown();
                    }
                });
                $scope.$on('$destroy', function() {
                    $html.off(eventName);
                });

            }
        };
    });
