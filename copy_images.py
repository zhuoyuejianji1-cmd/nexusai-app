#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
复制图片到项目目录并修正路径
"""

import json
import os
import shutil


def copy_images_and_fix_paths():
    """复制图片并修正路径"""
    
    # 源目录和目标目录
    source_images_dir = 'c:/Users/wenzai/Desktop/ai数据网/projects/shujuzhuanqu-youyouyunchang/data/images'
    target_images_dir = 'c:/Users/wenzai/Desktop/ai数据网/projects/public/images'
    courses_json_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
    
    # 创建目标目录
    if not os.path.exists(target_images_dir):
        os.makedirs(target_images_dir)
        print(f'✅ 创建目录: {target_images_dir}')
    
    # 读取课程数据
    print(f'📂 正在读取课程数据...')
    with open(courses_json_path, encoding='utf-8') as f:
        courses = json.load(f)
    
    print(f'✅ 已加载 {len(courses)} 门课程')
    
    # 统计
    copied_count = 0
    fixed_count = 0
    error_count = 0
    
    # 遍历所有课程，复制图片并修正路径
    for idx, course in enumerate(courses):
        # 处理封面图
        thumbnail = course.get('thumbnail', '')
        if thumbnail:
            # 修正路径格式：把 \ 替换为 /
            fixed_thumbnail = thumbnail.replace('\\', '/')
            
            # 如果路径以 /images 开头，转换为相对路径
            if fixed_thumbnail.startswith('/images'):
                # 提取文件名
                # 例如: /images/113198/20260405124801-69d25a0117176.jpeg
                parts = fixed_thumbnail.split('/')
                if len(parts) >= 4:
                    course_id = parts[2]  # 113198
                    filename = parts[3]   # 20260405124801-69d25a0117176.jpeg
                    
                    source_path = os.path.join(source_images_dir, course_id, filename)
                    target_dir = os.path.join(target_images_dir, course_id)
                    target_path = os.path.join(target_dir, filename)
                    
                    # 创建课程图片目录
                    if not os.path.exists(target_dir):
                        os.makedirs(target_dir)
                    
                    # 复制图片
                    if os.path.exists(source_path):
                        if not os.path.exists(target_path):
                            shutil.copy2(source_path, target_path)
                            copied_count += 1
                        
                        # 修正路径为项目中的路径
                        course['thumbnail'] = f'/images/{course_id}/{filename}'
                        fixed_count += 1
                    else:
                        error_count += 1
                        print(f'⚠️  找不到图片: {source_path}')
        
        # 处理详情图片
        detail_images = course.get('detailImages', [])
        fixed_detail_images = []
        for img_path in detail_images:
            # 修正路径格式
            fixed_path = img_path.replace('\\', '/')
            fixed_detail_images.append(fixed_path)
        
        course['detailImages'] = fixed_detail_images
        
        if (idx + 1) % 500 == 0:
            print(f'✅ 已处理 {idx + 1}/{len(courses)} 门课程')
    
    # 保存修正后的数据
    print(f'\n💾 正在保存修正后的数据...')
    with open(courses_json_path, 'w', encoding='utf-8') as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)
    
    print(f'\n✨ 处理完成！')
    print(f'📊 统计信息:')
    print(f'   总课程数: {len(courses)}')
    print(f'   复制图片: {copied_count} 张')
    print(f'   修正路径: {fixed_count} 个')
    print(f'   错误数量: {error_count} 个')


if __name__ == '__main__':
    print('=' * 60)
    print('🚀 开始复制图片并修正路径...')
    print('=' * 60)
    
    copy_images_and_fix_paths()
    
    print('\n' + '=' * 60)
    print('✨ 全部完成！')
    print('=' * 60)
