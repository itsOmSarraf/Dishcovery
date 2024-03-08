import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeProviderContext = createContext({
	theme: 'system',
	setTheme: () => null
});

export function ThemeProvider({
	children,
	defaultTheme = 'dark',
	storageKey = 'vite-ui-theme',
	...props
}) {
	const [theme, setTheme] = useState(
		() => localStorage.getItem(storageKey) || defaultTheme
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? 'dark'
				: 'light';

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const value = {
		theme,
		setTheme: (newTheme) => {
			localStorage.setItem(storageKey, newTheme);
			setTheme(newTheme);
		}
	};

	return React.createElement(ThemeProviderContext.Provider, {
		...props,
		value: value,
		children: children
	});
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};
