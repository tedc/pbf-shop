import { createUserInputData, TableStyles, pricelistLayouts } from '../../utils/user';
import { isEmpty, isNull } from 'lodash';


const Pricelist = ({pricelist, isModal}) => (
    <>
    { !isNull(pricelist) && !isEmpty(pricelist) && <div className="pricelist" style={{paddingTop:60}}>
        <h4 className="title title--grow-40-bottom"><strong>La tua pricelist</strong></h4>
        <table className="table table--private">
            <thead>
                <tr>
                    {
                        pricelistLayouts.map((th, index)=>(
                            <th key={`${th.key}-${index}`}>
                                <strong>{ isModal ? th.key : th.label}</strong>
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    pricelist.map((tr, index)=> (
                <tr key={`tr-${index}`}>
                    {
                        pricelistLayouts.map((td, index)=>(
                            <td key={`${td.key}-${index}`}>
                                {tr[td.key]}
                            </td>
                        ))
                    }
                </tr>
                ))
            }
            </tbody>
        </table>
        <style jsx>{
            TableStyles
        }</style>
    </div> }
    </>
)

export default Pricelist