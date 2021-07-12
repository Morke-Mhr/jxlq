

const filters = {
  status(value) { //task   任务状态
    if (!value) return ''
    if (value == 1) {
      return "待发布";
    } else if (value == 2) {
      return "已发布";
    } else if (value == 3) {
      return "待执行";
    } else if (value == 4) {
      return "已执行";
    } else if (value == 5) {
      return "待完成";
    } else if (value == 6) {
      return "已完成";
    } else if (value == 8) {
      return "待验收";
    } else if (value == 9) {
      return "已验收";
    } else if (value == 10) {
      return "已逾期";
    } else if (value == 11) {
      return "已结束";
    }
    // else if (value == 7) {
    //   return "待审核";
    // } else if (value == 8) {
    //   return "已审核";
    // }
  },
  difficulty(value) {   //task  难度单位
    if (value == 1) {
      return "简单";
    } else if (value == 2) {
      return "一般";
    } else if (value == 3) {
      return "较难";
    } else {
      return "很难";
    }
  },
  costTimeUnit(value) {   //task  时长单位
    if (value == 0) {
      return "天";
    } else if (value == 1) {
      return "小时";
    } else if (value == 2) {
      return "月";
    }
  },
  //任务验收满意度
  degree(value) {
    if (value == 0) {
      return "非常满意";
    } else if (value == 1) {
      return "满意";
    } else if (value == 2) {
      return "一般";
    } else if (value == 3) {
      return "不满意";
    } else if (value == 4) {
      return "很不满意";
    }
  },
  //测验状态
  exam_topicState(value) {
    if (value == 0) {
      return "禁用";
    } else if (value == 1) {
      return "待提交";
    } else if (value == 4) {
      return "已提交";
    }
  },
  //奖惩记录 奖惩类型
  yearcompliance(value) {
    if (value == 0) {
      return "奖励";
    } else if (value == 1) {
      return "惩罚";
    }
  },
  //年度考核目标达标明细 达标
  year_compliance_detail(value) {
    if (value == 0) {
      return "合格";
    } else if (value == 1) {
      return "不合格";
    }
  },
  //审批状态
  approverStatus(value) {
    if (value == 0) {
      return "待审批";
    } else if (value == 1) {
      return "审批中";
    } else if (value == 2) {
      return "已驳回";
    } else if (value == 3) {
      return "已完成";
    }
  },
    //审批状态
    approverStatusxx(value) {
      if (value == 0) {
        return "不需要审批";
      } else if (value == 1) {
        return "审批中";
      } else if (value == 2) {
        return "已驳回";
      } else if (value == 3) {
        return "已完成";
      }
    },

  // 考试状态
  examStatus(value) {
    if (value == 0) {
      return "未测验";
    } else if (value == 1) {
      return "已测验";
    }
  },
  ellipsis(value, len) {
    if (!value) return ''
    if (value.length > len) {
      return value.slice(0, len) + '...'
    }
    return value
  }
}

export default filters