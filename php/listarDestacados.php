<?php
include 'conexion.php';

$stmt = $con->query("SELECT * FROM productos WHERE destacado = 1 ORDER BY id DESC");
$productos = $stmt->fetchAll();

if (count($productos) > 0) {
    echo "<style>
        .slider-container {
            position: relative;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            overflow: hidden;
            border-radius: 25px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 3px rgba(52, 152, 219, 0.1);
            background: #fff;
        }
        .slider {
            display: flex;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide {
            min-width: 100%;
            position: relative;
        }
        .slide img {
            width: 100%;
            height: 550px;
            object-fit: cover;
            display: block;
        }
        .slide-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%);
            color: white;
            padding: 2.5rem 2rem;
            text-align: center;
        }
        .slide-overlay h4 {
            margin: 0 0 0.8rem 0;
            font-size: 2rem;
            font-weight: 600;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            letter-spacing: 0.5px;
        }
        .slide-overlay p {
            margin: 0.5rem 0;
            font-size: 1.1rem;
            line-height: 1.6;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .slide-overlay .price {
            margin: 1rem 0 0 0;
            font-weight: bold;
            font-size: 1.8rem;
            color: #ffd700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
        .slider-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.95);
            color: #2c3e50;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            z-index: 10;
        }
        .slider-btn:hover {
            background: #3498db;
            color: white;
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.5);
        }
        .slider-btn.prev {
            left: 20px;
        }
        .slider-btn.next {
            right: 20px;
        }
        .dots {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        }
        .dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid rgba(255,255,255,0.8);
        }
        .dot:hover {
            background: rgba(255,255,255,0.8);
            transform: scale(1.2);
        }
        .dot.active {
            background: #3498db;
            border-color: #fff;
            width: 18px;
            height: 18px;
            box-shadow: 0 0 10px rgba(52, 152, 219, 0.8);
        }
    </style>";
    echo "<div class='slider-container'>";
    echo "<div class='slider' id='featured-slider'>";
    foreach ($productos as $index => $producto) {
        $active = $index == 0 ? 'active' : '';
        echo "<div class='slide $active'>";
        if ($producto['imagen_url']) {
            echo "<img src='/CRUD/" . htmlspecialchars($producto['imagen_url']) . "' alt='Imagen del producto'>";
        } else {
            echo "<div style='width:100%; height:550px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;'>Sin imagen</div>";
        }
        echo "<div class='slide-overlay'>";
        echo "<h4>" . htmlspecialchars($producto['nombre']) . "</h4>";
        echo "<p>" . htmlspecialchars($producto['descripcion']) . "</p>";
        echo "<p class='price'>Precio: $" . htmlspecialchars($producto['precio']) . "</p>";
        echo "</div>";
        echo "</div>";
    }
    echo "</div>";
    echo "<button class='slider-btn prev' onclick='changeSlide(-1)' aria-label='Slide anterior'>❮</button>";
    echo "<button class='slider-btn next' onclick='changeSlide(1)' aria-label='Slide siguiente'>❯</button>";
    echo "<div class='dots'>";
    foreach ($productos as $index => $producto) {
        $active = $index == 0 ? 'active' : '';
        echo "<span class='dot $active' onclick='goToSlide($index)' aria-label='Ir al slide $index'></span>";
    }
    echo "</div>";
    echo "</div>";
    echo "<script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const totalSlides = slides.length;

        function showSlide(index) {
            if (index >= totalSlides) currentSlide = 0;
            if (index < 0) currentSlide = totalSlides - 1;
            document.querySelector('.slider').style.transform = 'translateX(-' + currentSlide * 100 + '%)';
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }

        function changeSlide(direction) {
            currentSlide += direction;
            showSlide(currentSlide);
        }

        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }

        setInterval(() => {
            changeSlide(1);
        }, 5000);

        showSlide(currentSlide);
    </script>";
} else {
    echo "<p>No hay productos destacados en este momento.</p>";
}
?>