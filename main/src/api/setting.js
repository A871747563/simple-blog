// 这是登录页动态背景配置
export const settingLogin = {
  particles: {
    number: {
      value: 16,
      density: {
        enable: true,
        value_area: 600
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: 'img/github.svg',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.25,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 10,
      random: true,
      anim: {
        enable: false,
        speed: 2,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: false,
      distance: 300,
      color: '#ffffff',
      opacity: 0,
      width: 0
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'top',
      random: true,
      straight: true,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
        mode: 'repulse'
      },
      onclick: {
        enable: false,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 800,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 800,
        size: 80,
        duration: 2,
        opacity: 0.8,
        speed: 3
      },
      repulse: {
        distance: 400,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
}
export const setting404 = {
  fps_limit: 60,
  interactivity: {
    detect_on: 'canvas',
    events: {
      onclick: { enable: true, mode: 'repulse' },
      onhover: {
        enable: true,
        mode: 'bubble',
        parallax: { enable: false, force: 2, smooth: 10 }
      },
      resize: true
    },
    modes: {
      bubble: { distance: 250, duration: 2, opacity: 0, size: 0, speed: 3 },
      /* eslint-disable */
      grab: { distance: 400, line_linked: { opacity: 1 } },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
      repulse: { distance: 400, duration: 0.4 }
    }
  },
  particles: {
    color: { value: '#ffffff' },
    line_linked: {
      color: '#ffffff',
      distance: 150,
      enable: false,
      opacity: 0.4,
      width: 1
    },
    move: {
      size: true,
      attract: { enable: false, rotateX: 600, rotateY: 600 },
      bounce: false,
      direction: 'none',
      enable: true,
      out_mode: 'out',
      random: true,
      speed: 0.3,
      straight: false
    },
    number: { density: { enable: true, value_area: 800 }, value: 160 },
    opacity: {
      anim: { enable: true, opacity_min: 0, speed: 1, sync: false },
      random: true,
      value: 1
    },
    shape: {
      character: {
        fill: false,
        font: 'Verdana',
        style: '',
        value: '*',
        weight: '400'
      },
      image: {
        height: 100,
        replace_color: true,
        src: 'images/github.svg',
        width: 100
      },
      polygon: { nb_sides: 5 },
      stroke: { color: '#000000', width: 0 },
      type: 'circle'
    },
    size: {
      anim: { enable: false, size_min: 0.3, speed: 4, sync: false },
      random: true,
      value: 3
    }
  },
  polygon: {
    draw: { enable: false, lineColor: '#ffffff', lineWidth: 0.5 },
    move: { radius: 10 },
    scale: 1,
    type: 'none',
    url: ''
  },
  retina_detect: true
}
