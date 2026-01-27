"use strict";

module.exports = {
	types: [
		{ value: "feat", name: "特性:一个新的特性" },
		{ value: "fix", name: "修复:修复一个Bug" },
		{ value: "docs", name: "文档:变更的只有文档" },
		{ value: "style", name: "格式:空格, 分号等格式修复" },
		{ value: "refactor", name: "重构:代码重构，注意和特性、修复区分开" },
		{ value: "perf", name: "性能:提升性能" },
		{ value: "test", name: "测试:添加一个测试" },
		{ value: "build", name: "构建:构建流程、外部依赖变更(如升级npm包、修改webpack配置等)" },
		{ value: "chore", name: "回滚:代码回退" },
	],

	scopes: [
		{ name: "模块1" },
		{ name: "模块2" },
		{ name: "模块3" },
		{ name: "模块4" },
	],

	messages: {
		type: "选择一种你的提交类型:",
		scope: "选择一个scope (可选):",
		customScope: "Denote the SCOPE of this change:",
		subject: "短说明:\n",
		body: '长说明，使用"|"换行(可选)：\n',
		breaking: "非兼容性说明 (可选):\n",
		footer: "关联关闭的issue，例如：#31, #34(可选):\n",
		confirmCommit: "确定提交说明?",
	},

	allowCustomScopes: true,
	allowBreakingChanges: ["特性", "修复"],

	// 限制提交信息长度
	subjectLimit: 100,
};
