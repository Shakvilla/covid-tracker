import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoCard.css'

function InfoCard({ title, cases, total, active, isRed, ...props }) {
    return (

        <Card onClick={props.onClick} className={`infoCard ${active && 'infoCard--selected'} ${isRed && 'infoCard--red'}`}>
            <CardContent>
                <Typography color="textSecondary" className="infoCard__title">
                    {title}
                </Typography>

                <h2 className={`infoCard__cases ${!isRed && "infoCard__cases--green"}`}>{cases}</h2>

                <Typography color="textSecondary" className="infoCard__total">
                    {total} Total
                </Typography>

            </CardContent>
        </Card >
    )
}

export default InfoCard
