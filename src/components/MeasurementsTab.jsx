import { sizeMeasurements } from '../data/mockData.js'

export default function MeasurementsTab() {
  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📏</span>
          成品尺寸表（单位：cm）
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
          S 码为基准码，各部位尺寸依据国家标准 GB/T 1335.2-2008 女装标准设定。
        </p>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="row-name">部位</th>
                {sizeMeasurements.sizes.map((s) => (
                  <th key={s} className={s === 'S' ? 'base-size' : ''}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeMeasurements.rows.map((row, i) => (
                <tr key={i}>
                  <td className="row-name">
                    {row.name}
                    <div style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400 }}>
                      {row.nameEn}
                    </div>
                  </td>
                  {row.values.map((val, j) => (
                    <td key={j} className={sizeMeasurements.sizes[j] === 'S' ? 'base-size' : ''}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📐</span>
          测量方法说明
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p><strong>衣长：</strong>后颈点至下摆边缘的垂直距离</p>
          <p><strong>胸围：</strong>腋下 2cm 处水平围量一周</p>
          <p><strong>腰围：</strong>腰部最细处水平围量一周</p>
          <p><strong>肩宽：</strong>左右肩点之间的距离</p>
          <p><strong>袖长：</strong>肩点至袖口边缘的距离</p>
          <p><strong>领围：</strong>领口下沿围量一周</p>
        </div>
      </div>
    </div>
  )
}
