const checkIsNavigationSupported = () => {
	return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
	const response = await fetch(url)
	const text = await response.text()
	const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
    return data
}

export const startViewTransition = () => {
	if (!checkIsNavigationSupported()) return

	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)

		// es una pagina externa? si es asi, lo ignoramos
		if (location.origin !== toUrl.origin) return

		// si es una navegacion en el mismo origen
		event.intercept({
			async handle () {
				const data = await fetchPage(toUrl.pathname)

				// utilizar la api de view transition
				document.startViewTransition(() => {
					// scroll hacia arriba del todo
					document.body.innerHTML = data
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}