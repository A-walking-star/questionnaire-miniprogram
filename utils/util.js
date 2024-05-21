"use strict";
import dayjs from 'dayjs';
const toString = Object.prototype.toString;

const formatTime = (date, template) => dayjs(date).format(template);

const svg2imgdata = (svg) => {
  if (toString.call(svg) !== "[object String]") return svg;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const base2str = (base64) => {
  if (toString.call(base64) !== "[object String]") return base64;
  return decodeURIComponent(base64);
}

let systemWidth = 0;
/** 获取系统宽度，为了减少启动消耗所以在函数里边做初始化 */
const loadSystemWidth = () => {
  if (systemWidth) {
    return systemWidth;
  }

  try {
    ({ screenWidth: systemWidth } = wx.getSystemInfoSync());
  } catch (e) {
    systemWidth = 0;
  }
  return systemWidth;
};

/**
 * 比较两个版本号
 * @param {String} v1 第一个版本号
 * @param {String} v2 第二个版本号
 * @returns {Number} 第一个版本号>第二个版本号 return 1；第一个版本号<第二个版本号 return 2；第一个版本号==第二个版本号 return 0
 */
const compareVersion = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

/**
 * 转换rpx为px
 *
 * @description
 * 什么时候用？
 * - 布局(width: 172rpx)已经写好, 某些组件只接受px作为style或者prop指定
 *
 */
const rpx2px = (rpx, round = false) => {
  loadSystemWidth();

  // px / systemWidth = rpx / 750
  const result = (rpx * systemWidth) / 750;

  if (round) {
    return Math.floor(result);
  }

  return result;
};

/**
 * 清除数据中的null和undefined
 * @param {any} obj 处理对象
 * @param {Number} layer 处理几层（-1为全部）
 */
const pruneObj = ({ obj, target, layer = -1 }) => {
  if (!obj) throw "缺少obj";
  const type = toString.call(obj)
  var template = {
    arrStr: "[object Array]",
    objStr: "[object Object]",
    nullStr: "[object Null]",
    undefinedStr: "[object Undefined]",
  },
    target = target || (type == template.arrStr ? [] : {});
  if (type !== template.arrStr && type !== template.objStr) return obj;
  for (let prop in obj) {
    // 判断是否为特定的自身属性
    if (obj.hasOwnProperty(prop)) {
      const TOtarget = toString.call(obj[prop]);
      if ((layer === -1 || layer > 0) && (TOtarget == template.nullStr || TOtarget == template.undefinedStr || (TOtarget == template.arrStr && obj[prop].length == 0) || (TOtarget == template.objStr && Object.keys(obj[prop]).length == 0))) {
        continue
      }
      // 如果是对象
      if (TOtarget === template.arrStr || TOtarget === template.objStr) {
        pruneObj({ obj: obj[prop], target: target[prop] = TOtarget == template.arrStr ? [] : {}, layer: layer !== -1 ? layer - 1 : layer });
      } else {
        // 如果是原始值
        target[prop] = obj[prop];
      }
    }
  }
  return target;
}

/**
 * 浅拷贝
 * @param {*} origin 需要拷贝的数据
 * @return {*} object 
 */
const simpleClone = (origin) => {
  if (toString.call(origin) === "[object Object]"){
    return { ...origin };
  }
  return origin;
}

/**
 * 深度拷贝
 * @param {any} origin 需要拷贝的数据
 * @param {any | null | undefined} target (可选)拷贝完成的数据
 * @returns object
 */
const deepClone = (origin, target) => {
  // 过滤特俗情况
  if(origin===null) return origin
  if(typeof origin !=='object') return origin
  if(origin instanceof RegExp){
    return new RegExp(origin)
  }
  if(origin instanceof Date){
    return new Date(origin)
  }
  var arrStr = "[object Array]",
    target = target || (toString.call(origin) === arrStr ? [] : {});
  for (let prop in origin) {
    // 判断是否为特定的自身属性
    if (origin.hasOwnProperty(prop)) {
      // 如果是对象
      if (origin[prop] !== null && typeof (origin[prop]) === 'object') {
        target[prop] = deepClone(origin[prop], target[prop] = toString.call(origin[prop]) === arrStr ? [] : {});
      } else {
        // 如果是原始值
        target[prop] = origin[prop];
      }
    }
  }
  return target;
};

module.exports = {
  formatTime,
  svg2imgdata,
  base2str,
  rpx2px,
  pruneObj,
  simpleClone,
  deepClone,
  compareVersion,
};
