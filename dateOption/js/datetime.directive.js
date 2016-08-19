// 时间区间和时间单选控件
'use strict';
angular.module('core',[])
    .directive("datetime", function() {
        return {
            restrict: "AE",
            templateUrl: "datetime.template.html",
            replace: true,
            //@单向文本绑定，=双向绑定，&在父scope中执行函数
            scope: {
                date: '=',
                options:'='
            },
            link: function(scope, elem, attrs) {
                //设置dropdown是左对齐input还是右对齐input
                if(!scope.options){
                    $('.tsa-dropdown').removeClass('tsa-dropdown-right');
                    $('.tsa-dropdown').addClass('tsa-dropdown-left');
                }else{
                    $('.tsa-dropdown').removeClass('tsa-dropdown-left');
                    $('.tsa-dropdown').addClass('tsa-dropdown-right');
                }
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
                
                var date = {};
                /**
                 * 设置input的value值
                 */
                var setDatetimeInputValue = function(startDate,endDate){
                    elem.find('.tsa-datetime-input')[0].value = startDate.format('YYYY-MM-DD HH:mm:ss') + ' 至 ' 
                        + endDate.format('YYYY-MM-DD HH:mm:ss');
                };

                // setDatetimeInputValue(moment(date.startDate),moment(date.endDate)); //进入页面初始化input输入框的value

                /**
                 * 左右日历标签的onChange函数，获取startDate，endDate
                 */
                var onChangeLeft = function(dateObj, dateStr, instance) {
                    date.startDate = moment(dateObj);

                    //left开始日期选定时，改变right日历标签中结束日期的不可选值
                    // 当天也可选，此时要判断时分秒的大小。决定确定按钮btnSuccess的可用性,调用方法isValidDateRange
                    configRight.disable = [
                        function(allDate) {
                            if (date.startDate) {
                                return moment(moment(allDate).format('YYYY-MM-DD')) - moment(date.startDate.format('YYYY-MM-DD')) < 0;
                            }
                        }
                    ];
                    new flatpickr(calenders[1], configRight);
                    isValidDateRange(date.startDate, date.endDate);
                };
                var onChangeRight = function(dateObj, dateStr, instance) {
                    date.endDate = moment(dateObj);//.format('YYYY-MM-DD HH:mm:ss');
                    isValidDateRange(date.startDate, date.endDate);
                };

                /**
                 * 结束时间是否大于开始时间,改变确定按钮的可使用性disabled
                 */ 
                var isValidDateRange = function(startDate, endDate) {
                    if (!endDate || startDate - endDate >= 0) {
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

                /**
                 * 点击input标签，显示时间选择面板
                 */
                datetimeInput.on('click', function(event) {
                    event.preventDefault();
                    showDropdown();
                });
                
                //侧边最近日期栏
                //获取开始时间和结束时间，开始时间为系统当前时间，结束时间为当前时间减去li对应的天数
                var before0days = moment(moment().format('YYYY-MM-DD')+" 00:00:00");
                var before7days = moment().subtract(7, 'days');
                var before14days = moment().subtract(14, 'days');
                var before30days = moment().subtract(30, 'days');
                
                $(".li-range").on('click', function() {
                    date.endDate = moment();
                    var index = $(".li-range").index(this);
                    $(".tsa-daysrange-container > .li-range").eq(index).addClass('li-range-active'); //选取带有指定 index 值的元素
                    $(".tsa-daysrange-container > .li-range").eq(index).siblings().removeClass('li-range-active');
                    if (index == 0)
                        date.startDate = before0days;
                    if (index == 1)
                        date.startDate = before7days;
                    if (index == 2)
                        date.startDate = before14days;
                    if (index == 3)
                        date.startDate = before30days;
                    setDatetimeInputValue(date.startDate,date.endDate);
                    scope.$apply(function() {
                        scope.date = date;
                    });
                });

                /**
                 * 点击日历标签上的确定按钮，更改域的开始和结束时间
                 */
                btnSuccess.on('click', function(event) {
                    event.preventDefault();
                    hideDropdown();
                    scope.$apply(function() {
                        scope.date = date;
                    });
                    setDatetimeInputValue(date.startDate,date.endDate);
                });

                //绑定和解绑点击事件：当点击事件不在elem上或者其子元素上时，隐藏面板
                var $html = $('html'),
                    eventName = "click.tsaDatetimeRange" + (Math.random() * 1000).toFixed(); // 生成一个随机的事件命名空间
                $html.on(eventName, function(event) {
                    if (!$(event.target).isChildAndSelfOf(elem)) {
                        hideDropdown();
                    }
                });
                scope.$on('$destroy', function() {
                    $html.off(eventName);
                });


            }
        };
    });