import React from 'react'
import CouponsTablePage from './couponsTables.tsx/couponsTable'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

export const metadata = {
  title: "Manage Coupons",
}

function ManageCoupon() {
  return (
    <div>
      <Breadcrumb pageName="Manage Coupons" />
      <CouponsTablePage/>
    </div>
    
  )
}

export default ManageCoupon
