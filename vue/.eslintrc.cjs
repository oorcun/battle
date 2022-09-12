/* eslint-env node */
module.exports = {
	root: true,
	'extends': [
		'plugin:vue/vue3-essential',
		'eslint:recommended'
	],
	overrides: [
		{
			files: [
				'cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}'
			],
			'extends': [
				'plugin:cypress/recommended'
			]
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
