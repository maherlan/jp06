<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProjectController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('home.html.twig');
    }
 
    #[Route('/prestations', name: 'prestations')]
 
    public function prestations(): Response
    {
        return $this->render('prestations.html.twig');
    }
 
    #[Route('/electricite', name: 'electricite')]
    public function electricite(): Response
    {
        return $this->render('electricite.html.twig');
    }
 
    #[Route('/maconnerie', name: 'maconnerie')]
    public function maconnerie(): Response
    {
        return $this->render('prestations.html.twig');
    }
 
    #[Route('/chauffage', name: 'chauffage')]
    public function chauffage(): Response
    {
        return $this->render('chauffage.html.twig');
    }
 
    #[Route('/peinture', name: 'peinture')]
    public function peinture(): Response
    {
        return $this->render('peinture.html.twig');
    }
 
    #[Route('/carrelage', name: 'carrelage')]
    public function carrelage(): Response
    {
        return $this->render('carrelage.html.twig');
    }

    #[Route('/menuiserie', name: 'menuiserie')]
    public function menuiserie(): Response
    {
        return $this->render('menuiserie.html.twig');
    }
 
    #[Route('/isolation', name: 'isolation')]
    public function isolation(): Response
    {
        return $this->render('isolation.html.twig');
    }
 
    #[Route('/galerie', name: 'galerie')]
    public function galerie(): Response
    {
        return $this->render('galerie.html.twig');
    }
 
    #[Route('/contact', name: 'contact')]
    public function contact(): Response
    {
        return $this->render('contact.html.twig');
    }
 
    #[Route('/mentions', name: 'mentions')]
    public function mentions(): Response
    {
        return $this->render('mentions.html.twig');
    }

    #[Route('/credits', name: 'credits')]
    public function credits(): Response
    {
        return $this->render('credits.html.twig');
    }
}
