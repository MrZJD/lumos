'use strict';

// -> 获取本月最后一天
function getLastDate(date) {
    var newYear = date.getFullYear();
    var newMonth = (date.getMonth())+1;
    if (newMonth >= 12) {
        newYear += 1;
        newMonth = 0;
    }

    date.setFullYear(newYear);
    date.setMonth(newMonth);
    date.setDate(0);

    return date;
}
// -> 获取本月第一天
function getFirstDate(date) {
    date.setDate(1);
    return date;
}

define(function (require, exports, module) {
    module.exports = {
        template: require('../template/calendar.html'),
        data: function () {
            return {
                currentDate: (new Date()).getDate(),
                show: false,
                rows: null
            };
        },
        props: {
            type: {
                type: String, // 'START_SUN' -> 从周一开始或者从周日开始
                default: 'START_MON'
            },
            date: {
                type: Number,
                default: Date.now()
            },
            exception: {
                type: Array,
                default: []
            }
        },
        computed: {
            sortDate: function () {
                // -> 根据 this.date -> 给出日历二位数组
                var firstDay = getFirstDate(new Date(this.date));
                var lastDay = getLastDate(new Date(this.date));

                var sortDate = [];
                var startWeekday = firstDay.getDay(); // -> 获取周几 周日为0
                var weekdayNum = lastDay.getDate(); // -> 获取该月的天数

                if (this.type === 'START_MON') {
                    startWeekday = startWeekday === 0 ? 7 : startWeekday;
                } else {
                    startWeekday += 1;
                }

                var flag = false;
                var count = 0;
                while (true) {
                    var temp = [];
                    for (var i=1; i<8; i++) {
                        if (i === startWeekday) {
                            flag = true; // -> 开始计数
                        }

                        if (flag) {
                            count < weekdayNum ? temp.push(++count) : temp.push(-1);
                        } else {
                            temp.push(-1);
                        }
                    }

                    sortDate.push(temp);

                    if (count >= weekdayNum) {
                        break;
                    }
                }
                return sortDate;
            }
        },
        methods: {
            toggleVisiable () {
                // -> 显示隐藏非当前周
                if (this.show) { // -> 则隐藏
                    this.hide();
                } else { // -> 显示
                    var rows = this.rows;
                    for (var i=0, len=rows.length; i<len; i++) {
                        rows[i].style.height = '3.25rem';
                    }
                }
                this.show = !this.show;
            },
            hide () {
                var rows;
                if (!this.rows) {
                    rows = this.$refs.calendar.getElementsByClassName('calendar-row');
                    this.rows = rows;
                } else {
                    rows = this.rows;
                }
                for (var i=0, len=rows.length; i<len; i++) {
                    var days = rows[i].getElementsByClassName('calendar-day');
                    var flag = false;
                    for (var j=0, jlen=days.length; j<jlen; j++) {
                        if (days[j].className.indexOf('current') > -1) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        rows[i].style.height = 0 + 'px';
                    }
                }
            }
        },
        mounted: function () {
            this.hide();
        }
    }
});