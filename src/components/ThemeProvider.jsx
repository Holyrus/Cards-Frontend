import { useQuery, useQueryClient } from "@tanstack/react-query";

const THEME_KEY = 'appTheme'

const getSavedTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'Green'
}

export const useTheme = () => {
  const queryClient = useQueryClient()

  const { data: theme } = useQuery({
    queryKey: ['theme'],
    queryFn: getSavedTheme,
    initialData: getSavedTheme,
  })

  const setTheme = (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    queryClient.setQueryData(['theme'], newTheme)
  }

  return { theme, setTheme }
}