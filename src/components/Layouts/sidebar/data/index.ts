import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/admin",
        items: [],
      },
      {
        title: "Orders",
        icon: Icons.Order,
        items: [
          {
            title: "Live Orders",
            url: "/admin/orders/live_orders",
          },
          {
            title: "Past Orders",
            url: "/admin/orders/past_orders",
          },
        ],
      },
      
      {
        title: "Riders",
        icon: Icons.Rider,
        url:'/admin/rider',
        items: [],
      },
      {
        title: "Restaurants",
        url: "/admin/restaurant",
        icon: Icons.Restaurant,
        items: [],
      },
      // {
      //   title: "Customers",
      //   icon: Icons.User,
      //   url: "/admin/customer",
      //   items: [],
      // },
      // {
      //   title: "Profile",
      //   url: "/admin/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/admin/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/admin/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/admin/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/admin/auth/sign-in",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Calender",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Calender",
  //           url: "/admin/calendar",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Forms",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Form Elements",
  //           url: "/admin/forms/form-elements",
  //         },
  //         {
  //           title: "Form Layout",
  //           url: "/admin/forms/form-layout",
  //         },
  //       ],
  //     },
  //   ],
  // },
];
