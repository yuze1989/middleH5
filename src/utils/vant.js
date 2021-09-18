import { Dialog, Toast } from 'vant';
import 'vant/lib/index.css';

export default {
  // Toast轻提示======================================
  // 文字轻提示
  inform(content) {
    Toast(content);
  },
  // 成功轻提示
  success(content) {
    Toast.success(content);
  },
  // 失败轻提示
  fail(content) {
    Toast.fail(content);
  },
  // 加载中轻提示
  loading(date) {
    Toast.loading({
      type: 'loading',
      duration: date,
      mask: false,
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '加载中',
    });
  },
  // Dialog弹框=================
  // 提示弹框（带“确认”按钮）
  alert(content) {
    Dialog.alert({
      title: '提示',
      message: content,
    });
  },
  // 确认弹窗（带“确认”、“取消”按钮）
  confirm(content) {
    return Dialog.confirm({
      title: '提示',
      message: content,
    });
  },
};
