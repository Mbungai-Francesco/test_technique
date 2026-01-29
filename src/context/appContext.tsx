import { createContext, useEffect, useState  } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/types'
import { getProfile } from '@/api/auth'

interface AppContextProps {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  id: string
  setId: React.Dispatch<React.SetStateAction<string>>
  route: string
  setRoute: React.Dispatch<React.SetStateAction<string>>
}

export const AppContext = createContext<AppContextProps | undefined>(
  undefined,
)

export const AppProvider = ({ children }: { children: ReactNode }) => {
//   const isBrowser = typeof window !== 'undefined'
//   const storedTheme = isBrowser ? localStorage.getItem('theme') : null
  const emptyUser: User = {
    id: '',
    lastName: '',
    email: '',
  }

  const [user, setUser] = useState(emptyUser);
  const [id, setId] = useState<string>('');
  const [route, setRoute] = useState<string>('')

  useEffect(() => {
    if(user.id !== '') setId(user.id);
    else 
      getProfile().then((profile) => {
        if (profile) {
          setUser(profile);
          setId(profile.id);
        }
      }   
    )
  }, [user.id])

  return (
    <AppContext.Provider value={{ user, setUser, route, setRoute, id, setId }}>
      {children}
    </AppContext.Provider>
  )
}