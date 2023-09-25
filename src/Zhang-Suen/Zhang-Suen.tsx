import { observer } from 'mobx-react-lite'
import { zhangStore } from './zhang.store'

 
const ZhangSuen = observer(() => {
  



  return (
    <div className='w-full min-h-full flex justify-center items-center flex-col gap-4'>
      <table>
        <thead>
        <tr>
          {new Array({length: 8}).fill(null).map((_,i) => <th key={i + 100}/>)}
        </tr>
        </thead>
        <tbody>
          {
            zhangStore.matrix.map((row, index) => (
              <tr key={index}>
                {
                  row.map((col, i) => (
                    <td key={i} className={`'p-4 border border-fuchsia-300 cursor-pointer' ${zhangStore.matrix[index][i] ? 'bg-black p-4' : ' bg-white p-4'}`} onClick={() => {
                      zhangStore.onCellClickHandler(index, i)
                    }}>{col}</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
      <button onClick={() => zhangStore.computeZhangSuen()} className='p-5 bg-slate-400'>
        Вычислить
      </button>
      <div className='flex gap-4 flex-wrap m-auto justify-center'>
          {
            !zhangStore.steps.length ? null : (
              zhangStore.steps.map((mtr, i1) => (
                <table key={i1} className='w-40'>
                <thead>
                <tr>
                  {new Array({length: 8}).fill(null).map((_,i) => <th key={i + 100}/>)}
                </tr>
                </thead>
                <tbody>
                  {
                    mtr.map((row, index) => (
                      <tr key={index}>
                        {
                          row.map((col, i) => (
                            <td key={i} className={`'p-4 border border-fuchsia-300 cursor-pointer' ${mtr[index][i] ? 'bg-black p-4' : ' bg-white p-4'}`}>{col}</td>
                          ))
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              ))
            )
          }
      </div>
    </div>
  )
})
 
export default ZhangSuen
 