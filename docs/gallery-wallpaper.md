---
title: 壁纸 # 相册详情
layout: custom # 自定义组件
single_column: true
---

<script setup>
const list = [
	'/images/gallery/wallpaper-01.jpg',
	'/images/gallery/wallpaper-02.jpg',
	'/images/gallery/wallpaper-03.jpg',
	'/images/gallery/wallpaper-04.jpg',
	'/images/gallery/wallpaper-05.jpg',
	'/images/gallery/wallpaper-06.jpg',
	'/images/gallery/wallpaper-07.jpg',
	'/images/gallery/wallpaper-08.jpg',
	'/images/gallery/wallpaper-09.jpg',
	'/images/gallery/wallpaper-10.jpg',
	'/images/gallery/wallpaper-11.jpg',
	'/images/gallery/wallpaper-12.jpg',
	'/images/gallery/wallpaper-13.jpg',
	'/images/gallery/wallpaper-14.jpg',
	'/images/gallery/wallpaper-15.jpg',
	'/images/gallery/wallpaper-16.jpg',
	'/images/gallery/wallpaper-17.jpg',
	'/images/gallery/wallpaper-18.jpg',
	'/images/gallery/wallpaper-19.jpg',
	'/images/gallery/wallpaper-20.jpg',
	'/images/gallery/wallpaper-21.jpg',
	'/images/gallery/wallpaper-22.jpg',
	'/images/gallery/wallpaper-23.jpg',
	'/images/gallery/wallpaper-24.jpg',
	'/images/gallery/wallpaper-25.jpg',
	'/images/gallery/wallpaper-26.jpg',
	'/images/gallery/wallpaper-27.jpg',
	'/images/gallery/wallpaper-28.jpg',
]
</script>

<div class="trm-card">
	<TrmGallery :srcs="list" />
</div>
