import { mountCompiled } from '@vidact/runtime'
import { App } from './App.jsx'
import './styles.css'

const host = document.querySelector('#app')
if (host === null) throw new Error('Missing #app host element')
mountCompiled(App, host)
