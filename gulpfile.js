import { src, dest, watch, series, parallel } from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";

const sassCompiler = gulpSass(sass);

const paths = {
  styles: {
    src: "assets/css/style.scss",
    dest: "dist/css",
  },
  scripts: {
    vendors: {
      list: [
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/@fortawesome/fontawesome-free/js/all.min.js",
        "node_modules/chart.js/dist/chart.umd.js",
      ],
      dest: "dist/js",
      filename: "vendors.min.js",
    },
    main: {
      src: "assets/js/script.js",
      dest: "dist/js",
      filename: "script.min.js",
    },
  },
  css: {
    vendors: {
      list: ["node_modules/bootstrap/dist/css/bootstrap.css"],
      dest: "dist/css",
      filename: "vendors.min.css",
    },
  },
};

const styles = () =>
  src(paths.styles.src)
    .pipe(
      sassCompiler().on("error", (err) => {
        console.error("Sass Compilation Error:", err.message);
        this.emit("end");
      })
    )
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest(paths.styles.dest));

const vendorScripts = () =>
  src(paths.scripts.vendors.list)
    .pipe(uglify())
    .pipe(concat(paths.scripts.vendors.filename))
    .pipe(dest(paths.scripts.vendors.dest));

const vendorStyles = () =>
  src(paths.css.vendors.list)
    .pipe(cleanCSS())
    .pipe(concat(paths.css.vendors.filename))
    .pipe(dest(paths.css.vendors.dest));

const mainScripts = () =>
  src(paths.scripts.main.src)
    .pipe(uglify())
    .pipe(concat(paths.scripts.main.filename))
    .pipe(dest(paths.scripts.main.dest));

const watchFiles = () => {
  watch("assets/css/**/*.scss", styles);
  watch("assets/js/**/*.js", mainScripts);
};

const build = series(styles, vendorScripts, vendorStyles, mainScripts);
export default parallel(build, watchFiles);
