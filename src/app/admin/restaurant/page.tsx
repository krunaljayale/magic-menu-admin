
import { Metadata } from 'next';
import React from 'react'
import RestaurantsTablesPage from './tables/page';

export const metadata: Metadata = {
  title: "Restaurants Page",
};

function RestaurantsPage() {
  return (
    <RestaurantsTablesPage/>
  )
}

export default RestaurantsPage
