
var base = './build_Pro'; 

module.exports = {
    dev:{
        clean:{
            src:base,
        },
        html: {
            src:'./dev/*.html',
            dest: base+"/", 
        },
        sass:{
            src :'./dev/css/**/*.scss',
            dest: base+"/css"       
        },
        js:{
            src :'./dev/js/**/*.js',
            dest: base+"/js"       
        },
        plugin:{
            src :'./dev/plugin/**/*',
            dest: base+"/plugin"       
        },
        img:{
            src :'./dev/images/**/*',
            dest: base+"/images"       
        },
        common:{
            src :'./dev/common/**/*',
            dest: base+"/common"       
        }
    },
    pro:{

    }
}