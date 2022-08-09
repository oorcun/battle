module.exports = {
	'env': {
		'browser': false,
		'node': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest'
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
	},
	globals: {
		'artifacts': 'readonly',
		'contract': 'readonly',
		'beforeEach': 'readonly',
		'context': 'readonly',
		'it': 'readonly',
		'expect': 'readonly',
		'assert': 'readonly'
	}
}
