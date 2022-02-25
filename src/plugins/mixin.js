export const mixin = {
    methods: {
        $toLocaleTimeString: function (date) {
            let newDate = new Date(date)
            return newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        $getGeneralDate(date) {
        const newDate = new Date(date);
        let months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
            ];

        return `${months[newDate.getMonth()-1]} ${newDate.getDate()}, ${newDate.getFullYear()}`
        },
        $isMobile(){
            let width =
              window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth
            return width <= 576
        },
        $capitalizeString(string){
            return string[0].toUpperCase() + string.slice(1)
        },
    },
}
