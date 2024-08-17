import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { GH_API } from './constants'
import type { FrameworksKeys, StyleKeys } from './types'

type Res<T = string, E = string> = {
  res: T
  err: E
  protocol: Protocol
}

type Method = 'text' | 'json'
type Protocol = 'api' | 'https'
type GHContents = Array<{ name: string; path: string; type: 'file' | 'dir' }>

export function apiFetch(protocol: Protocol) {
  return <T = string, E = string>(cmd: string, method: Method, headers: string = ''): Promise<Res<T, E>> => {
    return promisify(exec)(`${cmd} ${headers}`)
      .then(({ stderr, stdout }) => {
        return {
          res: (method === 'json' ? JSON.parse(stdout) : stdout) as T,
          err: stderr as E,
          protocol,
        }
      })
      .catch((err: Error) => {
        return {
          res: '' as T,
          err: err.message as E,
          protocol,
        }
      })
  }
}

export function httpsFetch(protocol: Protocol) {
  return <T = string, E = string>(url: string, method: Method, headers: RequestInit = {}): Promise<Res<T, E>> => {
    return fetch(url, headers)
      .then(async (res) =>
        res.status !== 200
          ? { res: '' as T, err: (await res.json().then((err) => err.message)) as E, protocol }
          : {
              res: (await res[method]()) as T,
              err: '' as E,
              protocol,
            }
      )
      .catch((err: Error) => {
        return {
          res: '' as T,
          err: err.message as E,
          protocol,
        }
      })
  }
}

export function createGitAPI(protocol: Protocol) {
  const call = (method: 'standard' | 'raw', url: string) => `${GH_API[protocol][method]}${url}`
  const fetch = protocol === 'api' ? apiFetch(protocol) : httpsFetch(protocol)
  return {
    listComponents: () => fetch<GHContents>(call('standard', GH_API.availableComponents), 'json'),
    componentFiles: (framework: FrameworksKeys, style: StyleKeys, component: string) =>
      fetch<GHContents>(call('standard', `${GH_API.generated}/${framework}/${style}/${component}`), 'json'),
    raw: <M extends Method, T = M extends 'json' ? Record<string, unknown> : string>(
      framework: FrameworksKeys,
      style: StyleKeys,
      component: string,
      path: string,
      method: M
    ) =>
      fetch<T>(
        call('raw', `${GH_API.generated}/${framework}/${style}/${component}/${path}`),
        method,
        // @ts-expect-error string & RequestInit breaks type, but this line is correct
        protocol === 'https'
          ? { headers: { Accept: 'application/vnd.github.v3.raw' } }
          : '-H "Accept: application/vnd.github.v3.raw"'
      ),
  }
}
