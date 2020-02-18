import { RecipesService } from './../recipes.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {

  loadedRecipe: Recipe;

  constructor(private activatedRoute: ActivatedRoute,
              private recipesServce: RecipesService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('recipeId')) {
        // redirect user
        return;
      }
      const recipeId = paramMap.get('recipeId');
      this.loadedRecipe = this.recipesServce.getRecipe(recipeId);
    });
  }

  onDeleteRecipe() {
    this.recipesServce.deleteRecipe(this.loadedRecipe.id);
    this.router.navigate(['/recipes']);
  }

}
